import {
  users,
  policies,
  analyses,
  claims,
  checklistItems,
  claimUpdates,
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private policies: Map<string, Policy>;
  private analyses: Map<string, Analysis>;
  private claims: Map<string, Claim>;
  private checklistItems: Map<string, ChecklistItem>;
  private claimUpdates: Map<string, ClaimUpdate>;

  constructor() {
    this.users = new Map();
    this.policies = new Map();
    this.analyses = new Map();
    this.claims = new Map();
    this.checklistItems = new Map();
    this.claimUpdates = new Map();
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
}

export const storage = new MemStorage();
