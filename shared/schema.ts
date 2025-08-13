import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Policy documents
export const policies = pgTable("policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fileName: varchar("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  extractedText: text("extracted_text"),
  analysisStatus: varchar("analysis_status").default("pending"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Analysis results
export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").references(() => policies.id).notNull(),
  riskScore: integer("risk_score"), // 0-100
  riskLevel: varchar("risk_level"), // low, medium, high
  summary: text("summary"),
  flaggedClauses: jsonb("flagged_clauses"), // array of clause objects
  recommendations: text("recommendations"),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Claims
export const claims = pgTable("claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  policyId: varchar("policy_id").references(() => policies.id).notNull(),
  claimNumber: varchar("claim_number").unique().notNull(),
  status: varchar("status").default("submitted"), // submitted, under_review, processing, decision, payment, completed
  amount: integer("amount"), // in cents
  description: text("description"),
  estimatedProcessingDays: integer("estimated_processing_days").default(10),
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Claim preparation checklist items
export const checklistItems = pgTable("checklist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: varchar("claim_id").references(() => claims.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").default(false),
  order: integer("order").notNull(),
  requiredDocuments: jsonb("required_documents"), // array of document types
  uploadedDocuments: jsonb("uploaded_documents"), // array of uploaded file info
  completedAt: timestamp("completed_at"),
});

// Claim status updates
export const claimUpdates = pgTable("claim_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: varchar("claim_id").references(() => claims.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  updateType: varchar("update_type").notNull(), // status_change, document_request, general_update
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = typeof policies.$inferInsert;
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;
export type Claim = typeof claims.$inferSelect;
export type InsertClaim = typeof claims.$inferInsert;
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type InsertChecklistItem = typeof checklistItems.$inferInsert;
export type ClaimUpdate = typeof claimUpdates.$inferSelect;
export type InsertClaimUpdate = typeof claimUpdates.$inferInsert;

export const insertPolicySchema = createInsertSchema(policies).omit({
  id: true,
  createdAt: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  completedAt: true,
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  claimNumber: true,
  submittedAt: true,
  updatedAt: true,
});

export const insertChecklistItemSchema = createInsertSchema(checklistItems).omit({
  id: true,
  completedAt: true,
});
