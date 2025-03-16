import { pgTable, text, serial, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  location: text("location").notNull(),
  bio: text("bio").notNull(),
  focus: text("focus").notNull(),
  joined: text("joined").notNull(),
  imageUrl: text("image_url").notNull(),
  email: text("email"),
  linkedin: text("linkedin"),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export const applicants = pgTable("applicants", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  whyJoin: text("why_join").notNull(),
  photoUrl: text("photo_url"),
  submittedAt: text("submitted_at").notNull(), // Changed from date to text for simplicity
  status: text("status").default("pending"), // pending, approved, rejected
});

export const insertApplicantSchema = createInsertSchema(applicants).omit({
  id: true,
  submittedAt: true,
});

export const applicantFormSchema = insertApplicantSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
});

export type InsertApplicant = z.infer<typeof insertApplicantSchema>;
export type Applicant = typeof applicants.$inferSelect;

export const selfies = pgTable("selfies", {
  id: serial("id").primaryKey(),
  teamMemberId: integer("team_member_id").notNull().references(() => teamMembers.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  // Replacing 'time' with 'message' as per database structure
  message: text("message"),
  location: text("location").notNull(),
  // Adding 'caption' as it exists in the database
  caption: text("caption"),
  // 'notes' was replaced with 'message' and 'caption' in the database
  photoUrl: text("photo_url"),
  submittedAt: text("submitted_at").notNull(),
});

export const insertSelfieSchema = createInsertSchema(selfies).omit({
  id: true,
  submittedAt: true,
});

export const selfieFormSchema = insertSelfieSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
  // Add time field needed by the form
  time: z.string().min(1, "Time is required"),
  // Support both field names (message and notes) for different form variants
  message: z.string().optional(),
  notes: z.string().optional(),
});

export type InsertSelfie = z.infer<typeof insertSelfieSchema>;
export type Selfie = typeof selfies.$inferSelect;
