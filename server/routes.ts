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
  
  // Generic route to handle any team member images by name
  // This is important for handling new members approved from applications
  app.get("/api/team-members/image/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team member ID" });
      }
      
      const teamMember = await storage.getTeamMember(id);
      if (!teamMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      // If the imageUrl is an absolute URL, redirect to it
      if (teamMember.imageUrl && (teamMember.imageUrl.startsWith('http://') || teamMember.imageUrl.startsWith('https://'))) {
        return res.redirect(teamMember.imageUrl);
      }
      
      // If no image URL or a relative URL that's not found, return a default image
      res.status(404).json({ message: "Image not available" });
    } catch (error) {
      console.error("Error fetching team member image:", error);
      res.status(500).json({ message: "Error fetching team member image" });
    }
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
  
  // Get selfies for a specific team member
  app.get("/api/team-members/:id/selfies", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team member ID" });
      }
      
      // Verify team member exists
      const teamMember = await storage.getTeamMember(id);
      if (!teamMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      const selfies = await storage.getSelfiesByTeamMemberId(id);
      res.json(selfies);
    } catch (error) {
      console.error("Error fetching team member selfies:", error);
      res.status(500).json({ message: "Error fetching team member selfies" });
    }
  });

  // Approve an applicant to become a team member
  app.post("/api/applicants/:id/approve", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      // First get the applicant data
      const applicant = await storage.getApplicant(id);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      // Create a new team member from the applicant data
      const newTeamMember = await storage.createTeamMember({
        name: `${applicant.firstName} ${applicant.lastName}`,
        role: "Educator",
        location: applicant.location,
        bio: applicant.whyJoin,
        focus: "Health Education",
        joined: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        imageUrl: applicant.photoUrl || ""
      });

      // Optionally, we could delete or mark the applicant as approved
      // For now, we'll leave the applicant in the system
      
      res.status(200).json({ 
        success: true, 
        message: "Applicant approved and added as team member",
        teamMember: newTeamMember
      });
    } catch (error) {
      console.error("Error approving applicant:", error);
      res.status(500).json({ message: "Error approving applicant" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
