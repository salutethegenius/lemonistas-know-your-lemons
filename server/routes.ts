import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { applicantFormSchema, selfieFormSchema } from "@shared/schema";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Team member routes
  app.get("/api/team-members", async (req: Request, res: Response) => {
    try {
      const teamMembers = await storage.getAllTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching team members" });
    }
  });
  
  // Team member image routes - must be before /:id route to avoid conflict
  app.get("/api/team-members/gwen", (req: Request, res: Response) => {
    const imagePath = path.join(__dirname, "../assets/Gwen.jpg");
    // Handle missing file
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send("Image not found");
    }
    res.sendFile(imagePath);
  });
  
  app.get("/api/team-members/ivalee", (req: Request, res: Response) => {
    const imagePath = path.join(__dirname, "../assets/Ivalee.jpg");
    // Handle missing file
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send("Image not found");
    }
    res.sendFile(imagePath);
  });
  
  app.get("/api/team-members/portia", (req: Request, res: Response) => {
    const imagePath = path.join(__dirname, "../assets/Portia Ebraim.jpg");
    // Handle missing file
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send("Image not found");
    }
    res.sendFile(imagePath);
  });
  
  app.get("/api/team-members/sam", (req: Request, res: Response) => {
    const imagePath = path.join(__dirname, "../assets/Sam (1).jpg");
    // Handle missing file
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send("Image not found");
    }
    res.sendFile(imagePath);
  });

  // Team member by ID route - must be last to avoid conflicting with named routes
  app.get("/api/team-members/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team member ID" });
      }
      
      const teamMember = await storage.getTeamMember(id);
      if (!teamMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      res.json(teamMember);
    } catch (error) {
      res.status(500).json({ message: "Error fetching team member" });
    }
  });

  // Applicant routes
  app.post("/api/applicants", async (req: Request, res: Response) => {
    try {
      const parsedBody = applicantFormSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid application data", 
          errors: parsedBody.error.errors 
        });
      }
      
      const applicantData = {
        ...parsedBody.data,
        submittedAt: new Date()
      };
      
      const newApplicant = await storage.createApplicant(applicantData);
      res.status(201).json(newApplicant);
    } catch (error) {
      res.status(500).json({ message: "Error creating applicant" });
    }
  });
  
  // Selfie routes
  app.post("/api/selfies", async (req: Request, res: Response) => {
    try {
      const parsedBody = selfieFormSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          message: "Invalid selfie data", 
          errors: parsedBody.error.errors 
        });
      }
      
      // Verify team member exists
      const teamMember = await storage.getTeamMember(parsedBody.data.teamMemberId);
      if (!teamMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      const selfieData = {
        ...parsedBody.data,
        submittedAt: new Date()
      };
      
      const newSelfie = await storage.createSelfie(selfieData);
      res.status(201).json(newSelfie);
    } catch (error) {
      console.error("Selfie upload error:", error);
      res.status(500).json({ message: "Error uploading selfie" });
    }
  });
  
  // Get all applicants for admin dashboard
  app.get("/api/applicants", async (req: Request, res: Response) => {
    try {
      const applicants = await storage.getAllApplicants();
      res.json(applicants);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      res.status(500).json({ message: "Error fetching applicants" });
    }
  });
  
  // Get all selfies for admin dashboard
  app.get("/api/selfies", async (req: Request, res: Response) => {
    try {
      const selfies = await storage.getAllSelfies();
      res.json(selfies);
    } catch (error) {
      console.error("Error fetching selfies:", error);
      res.status(500).json({ message: "Error fetching selfies" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
