import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { applicantFormSchema } from "@shared/schema";
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
  
  // Team member image routes
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

  const httpServer = createServer(app);
  return httpServer;
}
