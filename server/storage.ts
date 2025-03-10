import { 
  users, type User, type InsertUser,
  teamMembers, type TeamMember, type InsertTeamMember,
  applicants, type Applicant, type InsertApplicant,
  selfies, type Selfie, type InsertSelfie
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Team member methods
  getAllTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  
  // Applicant methods
  createApplicant(applicant: InsertApplicant): Promise<Applicant>;
  getAllApplicants(): Promise<Applicant[]>;
  
  // Selfie methods
  createSelfie(selfie: InsertSelfie): Promise<Selfie>;
  getAllSelfies(): Promise<Selfie[]>;
}

// Database implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getAllTeamMembers(): Promise<TeamMember[]> {
    return db.select().from(teamMembers);
  }
  
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member || undefined;
  }
  
  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db
      .insert(teamMembers)
      .values(member)
      .returning();
    return newMember;
  }
  
  async createApplicant(application: InsertApplicant): Promise<Applicant> {
    // Format the date as ISO string for compatibility
    const submittedAt = new Date().toISOString().split('T')[0];
    const [newApplicant] = await db
      .insert(applicants)
      .values({
        ...application,
        submittedAt
      })
      .returning();
    return newApplicant;
  }
  
  async getAllApplicants(): Promise<Applicant[]> {
    return db.select().from(applicants);
  }
  
  async createSelfie(selfieData: InsertSelfie): Promise<Selfie> {
    // Format the date as ISO string for compatibility
    const submittedAt = new Date().toISOString();
    const [newSelfie] = await db
      .insert(selfies)
      .values({
        ...selfieData,
        submittedAt
      })
      .returning();
    return newSelfie;
  }
  
  async getAllSelfies(): Promise<Selfie[]> {
    return db.select().from(selfies);
  }
}

// Uncomment the below class to use in-memory storage instead
/*
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teamMembersMap: Map<number, TeamMember>;
  private applicantsMap: Map<number, Applicant>;
  private userCurrentId: number;
  private teamMemberCurrentId: number;
  private applicantCurrentId: number;

  constructor() {
    this.users = new Map();
    this.teamMembersMap = new Map();
    this.applicantsMap = new Map();
    this.userCurrentId = 1;
    this.teamMemberCurrentId = 1;
    this.applicantCurrentId = 1;
    
    // Initialize with some team members
    this.initializeTeamMembers();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembersMap.values());
  }
  
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    return this.teamMembersMap.get(id);
  }
  
  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberCurrentId++;
    const teamMember: TeamMember = { ...member, id };
    this.teamMembersMap.set(id, teamMember);
    return teamMember;
  }
  
  async createApplicant(application: InsertApplicant): Promise<Applicant> {
    const id = this.applicantCurrentId++;
    const applicant: Applicant = { ...application, id };
    this.applicantsMap.set(id, applicant);
    return applicant;
  }
  
  async getAllApplicants(): Promise<Applicant[]> {
    return Array.from(this.applicantsMap.values());
  }
  
  private initializeTeamMembers() {
    const initialMembers: InsertTeamMember[] = [
      {
        name: "Gwen",
        role: "Lead Educator",
        location: "Nassau, Bahamas",
        bio: "With over 10 years of experience in health education, Gwen has been instrumental in bringing the \"Know Your Lemons\" breast health awareness program to communities across the Bahamas.",
        focus: "Education, Program Development",
        joined: "January 2020",
        imageUrl: "/api/team-members/gwen"
      },
      {
        name: "Ivalee",
        role: "Community Outreach",
        location: "Grand Bahama",
        bio: "Ivalee focuses on bringing breast health awareness to remote communities throughout the Bahamas, organizing workshops and educational sessions for women of all ages.",
        focus: "Community Outreach, Workshops",
        joined: "March 2020",
        imageUrl: "/api/team-members/ivalee"
      },
      {
        name: "Portia",
        role: "Senior Educator",
        location: "Eleuthera",
        bio: "Portia has dedicated her career to health education, specializing in creating accessible and understandable materials about breast health for diverse audiences.",
        focus: "Education, Material Development",
        joined: "February 2021",
        imageUrl: "/api/team-members/portia"
      },
      {
        name: "Sam",
        role: "Program Coordinator",
        location: "Abaco",
        bio: "Sam coordinates the \"Know Your Lemons\" program across multiple islands, ensuring consistent education and outreach efforts throughout the Bahamas.",
        focus: "Program Management, Coordination",
        joined: "April 2021",
        imageUrl: "/api/team-members/sam"
      }
    ];
    
    initialMembers.forEach(member => {
      this.createTeamMember(member);
    });
  }
}
*/

export const storage = new DatabaseStorage();
