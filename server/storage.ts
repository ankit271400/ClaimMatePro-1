import {
  users,
  policies,
  analyses,
  claims,
  checklistItems,
  claimUpdates,
  policyProducts,
  type User,
  type UpsertUser,
  type Policy,
  type InsertPolicy,
  type Analysis,
  type InsertAnalysis,
  type Claim,
  type InsertClaim,
  type ChecklistItem,
  type InsertChecklistItem,
  type ClaimUpdate,
  type InsertClaimUpdate,
  type PolicyProduct,
  type InsertPolicyProduct,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Policy operations
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  getPolicy(id: string): Promise<Policy | undefined>;
  getPoliciesByUser(userId: string): Promise<Policy[]>;
  updatePolicyText(id: string, extractedText: string): Promise<void>;
  updatePolicyAnalysisStatus(id: string, status: string): Promise<void>;
  
  // Analysis operations
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysisByPolicy(policyId: string): Promise<Analysis | undefined>;
  
  // Claim operations
  createClaim(claim: InsertClaim): Promise<Claim>;
  getClaimsByUser(userId: string): Promise<Claim[]>;
  getClaim(id: string): Promise<Claim | undefined>;
  updateClaimStatus(id: string, status: string): Promise<void>;
  
  // Checklist operations
  createChecklistItem(item: InsertChecklistItem): Promise<ChecklistItem>;
  getChecklistItemsByClaim(claimId: string): Promise<ChecklistItem[]>;
  updateChecklistItem(id: string, updates: Partial<ChecklistItem>): Promise<void>;
  
  // Claim updates operations
  createClaimUpdate(update: InsertClaimUpdate): Promise<ClaimUpdate>;
  getClaimUpdatesByClaim(claimId: string): Promise<ClaimUpdate[]>;
  
  // Policy product operations
  createPolicyProduct(product: InsertPolicyProduct): Promise<PolicyProduct>;
  getAllPolicyProducts(): Promise<PolicyProduct[]>;
  getPolicyProductsByCategory(category: string): Promise<PolicyProduct[]>;
  findSimilarPolicies(coverage: number, category: string): Promise<PolicyProduct[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private policies: Map<string, Policy>;
  private analyses: Map<string, Analysis>;
  private claims: Map<string, Claim>;
  private checklistItems: Map<string, ChecklistItem>;
  private claimUpdates: Map<string, ClaimUpdate>;
  private policyProducts: Map<string, PolicyProduct>;

  constructor() {
    this.users = new Map();
    this.policies = new Map();
    this.analyses = new Map();
    this.claims = new Map();
    this.checklistItems = new Map();
    this.claimUpdates = new Map();
    this.policyProducts = new Map();
    this.seedPolicyProducts();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      ...userData,
      id: userData.id || randomUUID(),
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    } as User;
    this.users.set(user.id, user);
    return user;
  }

  // Policy operations
  async createPolicy(policyData: InsertPolicy): Promise<Policy> {
    const id = randomUUID();
    const policy: Policy = {
      ...policyData,
      id,
      analysisStatus: "pending",
      createdAt: new Date(),
      uploadedAt: new Date(),
    } as Policy;
    this.policies.set(id, policy);
    return policy;
  }

  async getPolicy(id: string): Promise<Policy | undefined> {
    return this.policies.get(id);
  }

  async getPoliciesByUser(userId: string): Promise<Policy[]> {
    return Array.from(this.policies.values()).filter(p => p.userId === userId);
  }

  async updatePolicyText(id: string, extractedText: string): Promise<void> {
    const policy = this.policies.get(id);
    if (policy) {
      this.policies.set(id, { ...policy, extractedText });
    }
  }

  async updatePolicyAnalysisStatus(id: string, status: string): Promise<void> {
    const policy = this.policies.get(id);
    if (policy) {
      this.policies.set(id, { ...policy, analysisStatus: status });
    }
  }

  // Analysis operations
  async createAnalysis(analysisData: InsertAnalysis): Promise<Analysis> {
    const id = randomUUID();
    const analysis: Analysis = {
      ...analysisData,
      id,
      completedAt: new Date(),
    } as Analysis;
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAnalysisByPolicy(policyId: string): Promise<Analysis | undefined> {
    return Array.from(this.analyses.values()).find(a => a.policyId === policyId);
  }

  // Claim operations
  async createClaim(claimData: InsertClaim): Promise<Claim> {
    const id = randomUUID();
    const claimNumber = `CLM-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}`;
    const claim: Claim = {
      ...claimData,
      id,
      claimNumber,
      status: "submitted",
      estimatedProcessingDays: 10,
      submittedAt: new Date(),
      updatedAt: new Date(),
    } as Claim;
    this.claims.set(id, claim);
    return claim;
  }

  async getClaimsByUser(userId: string): Promise<Claim[]> {
    return Array.from(this.claims.values()).filter(c => c.userId === userId);
  }

  async getClaim(id: string): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async updateClaimStatus(id: string, status: string): Promise<void> {
    const claim = this.claims.get(id);
    if (claim) {
      this.claims.set(id, { ...claim, status, updatedAt: new Date() });
    }
  }

  // Checklist operations
  async createChecklistItem(itemData: InsertChecklistItem): Promise<ChecklistItem> {
    const id = randomUUID();
    const item: ChecklistItem = {
      ...itemData,
      id,
      isCompleted: false,
    } as ChecklistItem;
    this.checklistItems.set(id, item);
    return item;
  }

  async getChecklistItemsByClaim(claimId: string): Promise<ChecklistItem[]> {
    return Array.from(this.checklistItems.values())
      .filter(item => item.claimId === claimId)
      .sort((a, b) => a.order - b.order);
  }

  async updateChecklistItem(id: string, updates: Partial<ChecklistItem>): Promise<void> {
    const item = this.checklistItems.get(id);
    if (item) {
      const updatedItem = { ...item, ...updates };
      if (updates.isCompleted) {
        updatedItem.completedAt = new Date();
      }
      this.checklistItems.set(id, updatedItem);
    }
  }

  // Claim updates operations
  async createClaimUpdate(updateData: InsertClaimUpdate): Promise<ClaimUpdate> {
    const id = randomUUID();
    const update: ClaimUpdate = {
      ...updateData,
      id,
      createdAt: new Date(),
    } as ClaimUpdate;
    this.claimUpdates.set(id, update);
    return update;
  }

  async getClaimUpdatesByClaim(claimId: string): Promise<ClaimUpdate[]> {
    return Array.from(this.claimUpdates.values())
      .filter(update => update.claimId === claimId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  // Policy product operations
  async createPolicyProduct(productData: InsertPolicyProduct): Promise<PolicyProduct> {
    const id = randomUUID();
    const product: PolicyProduct = {
      ...productData,
      id,
      createdAt: new Date(),
    } as PolicyProduct;
    this.policyProducts.set(id, product);
    return product;
  }

  async getAllPolicyProducts(): Promise<PolicyProduct[]> {
    return Array.from(this.policyProducts.values());
  }

  async getPolicyProductsByCategory(category: string): Promise<PolicyProduct[]> {
    return Array.from(this.policyProducts.values())
      .filter(product => product.category === category);
  }

  async findSimilarPolicies(coverage: number, category: string): Promise<PolicyProduct[]> {
    return Array.from(this.policyProducts.values())
      .filter(product => 
        product.category === category && 
        product.coverage >= coverage * 0.5 && // Show policies with at least 50% of the coverage
        product.coverage <= coverage * 2 // Show policies up to 200% of the coverage
      )
      .sort((a, b) => b.claimSettlementRatio - a.claimSettlementRatio) // Sort by claim settlement ratio (best first)
      .slice(0, 5); // Return top 5 alternatives
  }

  private seedPolicyProducts() {
    // Seed with real Indian health insurance policies
    const products = [
      {
        policyName: "Star Health Family Optima",
        insurer: "Star Health",
        category: "health",
        coverage: 10, // 10 lakhs
        premium: 14000,
        waitingPeriod: 3,
        copay: 10,
        claimSettlementRatio: 92,
        exclusions: "Pre-existing diseases, cosmetic treatments, dental care",
        keyFeatures: ["Family floater", "Pre-post hospitalization", "Daycare procedures"],
        ageLimit: "18-65 years",
        familyFloater: true,
        preExistingDiseasesCovered: false,
        noClaimBonus: 50,
        roomRentCapping: "2% of sum insured"
      },
      {
        policyName: "HDFC ERGO Health Suraksha",
        insurer: "HDFC ERGO",
        category: "health",
        coverage: 5,
        premium: 8500,
        waitingPeriod: 2,
        copay: 20,
        claimSettlementRatio: 96,
        exclusions: "Cosmetic surgery, war injuries, nuclear risks",
        keyFeatures: ["Cashless treatment", "Health checkups", "Emergency assistance"],
        ageLimit: "18-70 years",
        familyFloater: false,
        preExistingDiseasesCovered: true,
        noClaimBonus: 25,
        roomRentCapping: "1% of sum insured"
      },
      {
        policyName: "ICICI Lombard Complete Health",
        insurer: "ICICI Lombard",
        category: "health",
        coverage: 15,
        premium: 22000,
        waitingPeriod: 2,
        copay: 0,
        claimSettlementRatio: 94,
        exclusions: "Self-inflicted injuries, substance abuse",
        keyFeatures: ["No copay", "Unlimited restoration", "Global coverage"],
        ageLimit: "91 days-75 years",
        familyFloater: true,
        preExistingDiseasesCovered: true,
        noClaimBonus: 50,
        roomRentCapping: "No limit"
      },
      {
        policyName: "Care Health Supreme",
        insurer: "Care Health",
        category: "health",
        coverage: 10,
        premium: 16500,
        waitingPeriod: 2,
        copay: 10,
        claimSettlementRatio: 89,
        exclusions: "Congenital diseases, experimental treatments",
        keyFeatures: ["OPD coverage", "Mental health cover", "Maternity benefits"],
        ageLimit: "18-65 years",
        familyFloater: true,
        preExistingDiseasesCovered: true,
        noClaimBonus: 100,
        roomRentCapping: "Single AC room"
      },
      {
        policyName: "Bajaj Allianz Health Guard",
        insurer: "Bajaj Allianz",
        category: "health",
        coverage: 7,
        premium: 11000,
        waitingPeriod: 4,
        copay: 15,
        claimSettlementRatio: 87,
        exclusions: "Dental treatments, fertility treatments",
        keyFeatures: ["Personal accident cover", "Daily cash allowance"],
        ageLimit: "18-60 years",
        familyFloater: false,
        preExistingDiseasesCovered: false,
        noClaimBonus: 20,
        roomRentCapping: "1.5% of sum insured"
      },
      {
        policyName: "Max Bupa Health Companion",
        insurer: "Max Bupa",
        category: "health",
        coverage: 20,
        premium: 28000,
        waitingPeriod: 1,
        copay: 5,
        claimSettlementRatio: 93,
        exclusions: "War, nuclear risks, intentional self-injury",
        keyFeatures: ["Reload benefit", "International coverage", "Health coaching"],
        ageLimit: "18-75 years",
        familyFloater: true,
        preExistingDiseasesCovered: true,
        noClaimBonus: 50,
        roomRentCapping: "No capping"
      },
      {
        policyName: "Apollo Munich Easy Health",
        insurer: "Apollo Munich",
        category: "health",
        coverage: 5,
        premium: 7800,
        waitingPeriod: 3,
        copay: 25,
        claimSettlementRatio: 85,
        exclusions: "Cosmetic surgery, obesity treatments",
        keyFeatures: ["Easy claim process", "24x7 helpline"],
        ageLimit: "18-65 years",
        familyFloater: false,
        preExistingDiseasesCovered: false,
        noClaimBonus: 10,
        roomRentCapping: "1% of sum insured"
      },
      {
        policyName: "Religare Health Total",
        insurer: "Religare Health",
        category: "health",
        coverage: 12,
        premium: 18000,
        waitingPeriod: 2,
        copay: 0,
        claimSettlementRatio: 91,
        exclusions: "Pre-existing mental disorders, AIDS",
        keyFeatures: ["Zero copay", "Domiciliary treatment", "Second opinion"],
        ageLimit: "18-70 years",
        familyFloater: true,
        preExistingDiseasesCovered: true,
        noClaimBonus: 75,
        roomRentCapping: "Private room"
      }
    ];

    products.forEach(product => {
      const id = randomUUID();
      const policyProduct: PolicyProduct = {
        ...product,
        id,
        createdAt: new Date(),
      } as PolicyProduct;
      this.policyProducts.set(id, policyProduct);
    });
  }
}

export const storage = new MemStorage();
