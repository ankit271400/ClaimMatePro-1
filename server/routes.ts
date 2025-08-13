import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzePolicy } from "./openai";
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

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Create policy record
      const policy = await storage.createPolicy({
        userId,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
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

      // Analyze with AI
      const analysis = await analyzePolicy(text);

      await storage.createAnalysis({
        policyId,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        summary: analysis.summary,
        flaggedClauses: analysis.flaggedClauses,
        recommendations: analysis.recommendations,
      });

      await storage.updatePolicyAnalysisStatus(policyId, "completed");
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

  const httpServer = createServer(app);
  return httpServer;
}
