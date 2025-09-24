import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzePolicy } from "./openai";
import { yellowSdk } from "./yellowSdk";
import multer from "multer";
import Tesseract from "tesseract.js";
import { z } from "zod";
import { insertPolicySchema, insertClaimSchema } from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Policy upload and analysis
  app.post('/api/policies/upload', upload.single('policy'), async (req: any, res) => {
    try {
      const userId = 'anonymous-user'; // Use anonymous user instead of authenticated user
      const file = req.file;
      const ipfsHash = req.body.ipfsHash; // IPFS hash from Pinata
      const walletAddress = req.body.walletAddress; // Wallet address from MetaMask

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Create policy record
      const policy = await storage.createPolicy({
        userId,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        ipfsHash: ipfsHash || undefined,
        walletAddress: walletAddress || undefined,
      });

      // Start OCR processing
      res.json({ policyId: policy.id, message: "Upload successful, processing started" });

      // Process OCR in background
      processOCR(policy.id, file.buffer);

    } catch (error) {
      console.error("Error uploading policy:", error);
      res.status(500).json({ message: "Failed to upload policy" });
    }
  });

  async function processOCR(policyId: string, fileBuffer: Buffer) {
    try {
      await storage.updatePolicyAnalysisStatus(policyId, "processing");

      // Extract text using Tesseract
      const { data: { text } } = await Tesseract.recognize(fileBuffer, 'eng');
      
      await storage.updatePolicyText(policyId, text);

      // Generate policy hash for blockchain verification
      const crypto = require('crypto');
      const policyHash = crypto.createHash('sha256').update(text).digest('hex');

      // Yellow Network Integration: Verify policy on-chain
      let blockchainVerified = false;
      try {
        if (!yellowSdk.isInitialized()) {
          await yellowSdk.initialize();
        }
        blockchainVerified = await yellowSdk.verifyPolicyOnChain(policyHash);
        console.log(`Policy ${policyId} blockchain verification: ${blockchainVerified ? 'SUCCESS' : 'FAILED'}`);
      } catch (yellowError) {
        console.warn('Yellow Network verification failed, continuing with regular analysis:', yellowError);
      }

      // Analyze with AI - Enhanced prompt to include blockchain verification status
      const enhancedText = blockchainVerified 
        ? `${text}\n\n[BLOCKCHAIN VERIFIED: This policy document has been cryptographically verified on Yellow Network's decentralized infrastructure]`
        : text;

      const analysis = await analyzePolicy(enhancedText);

      // Enhance recommendations with blockchain features if verified
      let enhancedRecommendations = analysis.recommendations;
      if (blockchainVerified) {
        enhancedRecommendations += "\n\n🔒 Blockchain Verification: Your policy has been verified on Yellow Network's decentralized infrastructure, ensuring document integrity and authenticity. This provides additional security for your insurance claims and policy management.";
      }

      await storage.createAnalysis({
        policyId,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        summary: analysis.summary,
        flaggedClauses: analysis.flaggedClauses,
        recommendations: enhancedRecommendations,
      });

      await storage.updatePolicyAnalysisStatus(policyId, "completed");
      
      // Store document hash securely using Yellow Network
      if (blockchainVerified) {
        try {
          await yellowSdk.storeSecureDocument(policyHash, {
            policyId,
            fileName: `policy_${policyId}`,
            timestamp: Date.now()
          });
        } catch (storageError) {
          console.warn('Yellow Network storage failed:', storageError);
        }
      }

    } catch (error) {
      console.error("Error processing policy:", error);
      await storage.updatePolicyAnalysisStatus(policyId, "failed");
    }
  }

  // Get policy analysis
  app.get('/api/policies/:id/analysis', async (req: any, res) => {
    try {
      const userId = 'anonymous-user';
      const policyId = req.params.id;

      const policy = await storage.getPolicy(policyId);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }

      const analysis = await storage.getAnalysisByPolicy(policyId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not ready" });
      }

      res.json({ policy, analysis });
    } catch (error) {
      console.error("Error fetching analysis:", error);
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  // Get user policies
  app.get('/api/policies', async (req: any, res) => {
    try {
      const userId = 'anonymous-user';
      const policies = await storage.getPoliciesByUser(userId);
      res.json(policies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      res.status(500).json({ message: "Failed to fetch policies" });
    }
  });

  // Create claim
  app.post('/api/claims', async (req: any, res) => {
    try {
      const userId = 'anonymous-user';
      const claimNumber = `CM-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const claimData = insertClaimSchema.parse({ ...req.body, userId });

      const claim = await storage.createClaim({ ...claimData, claimNumber });

      // Create default checklist items
      const defaultItems = [
        { title: "Gather Medical Records", description: "Collect all relevant medical documentation from your healthcare providers.", order: 1 },
        { title: "Complete Claim Form", description: "Fill out the official claim form with accurate information about your incident.", order: 2 },
        { title: "Submit Supporting Evidence", description: "Include photos, receipts, or other documentation that supports your claim.", order: 3 },
        { title: "Review Policy Coverage", description: "Verify that your claim falls within your policy coverage limits.", order: 4 },
        { title: "Submit Claim", description: "Submit your completed claim with all required documentation.", order: 5 },
      ];

      for (const item of defaultItems) {
        await storage.createChecklistItem({
          claimId: claim.id,
          ...item,
        });
      }

      // Create initial status update
      await storage.createClaimUpdate({
        claimId: claim.id,
        title: "Claim Submitted",
        description: "Your claim has been successfully submitted and assigned a claim number.",
        updateType: "status_change",
      });

      res.json(claim);
    } catch (error) {
      console.error("Error creating claim:", error);
      res.status(500).json({ message: "Failed to create claim" });
    }
  });

  // Get user claims
  app.get('/api/claims', async (req: any, res) => {
    try {
      const userId = 'anonymous-user';
      const claims = await storage.getClaimsByUser(userId);
      res.json(claims);
    } catch (error) {
      console.error("Error fetching claims:", error);
      res.status(500).json({ message: "Failed to fetch claims" });
    }
  });

  // Get claim details with checklist and updates
  app.get('/api/claims/:id', async (req: any, res) => {
    try {
      const userId = 'anonymous-user';
      const claimId = req.params.id;

      const claim = await storage.getClaim(claimId);
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }

      const checklistItems = await storage.getChecklistItemsByClaim(claimId);
      const updates = await storage.getClaimUpdatesByClaim(claimId);

      res.json({ claim, checklistItems, updates });
    } catch (error) {
      console.error("Error fetching claim details:", error);
      res.status(500).json({ message: "Failed to fetch claim details" });
    }
  });

  // Update checklist item
  app.put('/api/checklist/:id', async (req: any, res) => {
    try {
      const itemId = req.params.id;
      const { isCompleted } = req.body;

      await storage.updateChecklistItem(itemId, { isCompleted });
      res.json({ message: "Checklist item updated" });
    } catch (error) {
      console.error("Error updating checklist item:", error);
      res.status(500).json({ message: "Failed to update checklist item" });
    }
  });

  // Policy Comparison Routes
  // Get all policy products
  app.get('/api/policy-products', async (req: any, res) => {
    try {
      const products = await storage.getAllPolicyProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching policy products:", error);
      res.status(500).json({ message: "Failed to fetch policy products" });
    }
  });

  // Get policy products by category
  app.get('/api/policy-products/category/:category', async (req: any, res) => {
    try {
      const category = req.params.category;
      const products = await storage.getPolicyProductsByCategory(category);
      res.json(products);
    } catch (error) {
      console.error("Error fetching policy products by category:", error);
      res.status(500).json({ message: "Failed to fetch policy products" });
    }
  });

  // Compare policy - find similar alternatives
  app.get('/api/policies/:id/compare', async (req: any, res) => {
    try {
      const policyId = req.params.id;
      const policy = await storage.getPolicy(policyId);
      
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }

      // For demo, assume all uploaded policies are health insurance with 10L coverage
      // In reality, you'd extract this from the policy text or analysis
      const estimatedCoverage = 10; // lakhs
      const category = "health";
      
      const alternatives = await storage.findSimilarPolicies(estimatedCoverage, category);
      
      res.json({
        current: {
          id: policy.id,
          fileName: policy.fileName,
          estimatedCoverage,
          category
        },
        alternatives,
        comparisonDate: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error comparing policy:", error);
      res.status(500).json({ message: "Failed to compare policy" });
    }
  });

  // Get detailed comparison between policies
  app.post('/api/policies/compare-detailed', async (req: any, res) => {
    try {
      const { policyIds } = req.body;
      
      if (!Array.isArray(policyIds) || policyIds.length === 0) {
        return res.status(400).json({ message: "Policy IDs array is required" });
      }

      const policies = [];
      for (const id of policyIds) {
        const policy = await storage.getAllPolicyProducts().then(products => 
          products.find(p => p.id === id)
        );
        if (policy) {
          policies.push(policy);
        }
      }

      res.json({
        policies,
        comparisonMetrics: {
          coverageRange: {
            min: Math.min(...policies.map(p => p.coverage)),
            max: Math.max(...policies.map(p => p.coverage))
          },
          premiumRange: {
            min: Math.min(...policies.map(p => p.premium)),
            max: Math.max(...policies.map(p => p.premium))
          },
          bestClaimRatio: Math.max(...policies.map(p => p.claimSettlementRatio || 0)),
          shortestWaitingPeriod: Math.min(...policies.map(p => p.waitingPeriod || 0))
        }
      });
    } catch (error) {
      console.error("Error in detailed comparison:", error);
      res.status(500).json({ message: "Failed to perform detailed comparison" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
