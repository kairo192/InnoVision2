import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applicants = pgTable("applicants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  birthDate: text("birth_date").notNull(), // Store as ISO date string
  age: integer("age").notNull(),
  wilaya: text("wilaya").notNull(),
  phone: text("phone").notNull(),
  course: text("course").notNull(),
  locale: text("locale").notNull().default("fr"),
  pdfUrl: text("pdf_url"),
  applicationId: text("application_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  emailSent: boolean("email_sent").default(false),
});

export const applicantsRelations = relations(applicants, ({ one }) => ({
  // Add relations if needed in the future
}));

export const usersRelations = relations(users, ({ many }) => ({
  // Add relations if needed in the future
}));

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertApplicantSchema = createInsertSchema(applicants).omit({
  id: true,
  createdAt: true,
  applicationId: true,
  pdfUrl: true,
  emailSent: true,
  age: true, // Will be calculated from birthDate
}).extend({
  birthDate: z.string().min(1, "Date de naissance requise"),
  consent: z.boolean().refine(val => val === true, "Consentement requis"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertApplicant = z.infer<typeof insertApplicantSchema>;
export type Applicant = typeof applicants.$inferSelect;
