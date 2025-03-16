import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { applicantFormSchema, selfieFormSchema } from "@shared/schema";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import upload from './utils/upload';

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
  // Use a helper function to handle image requests for known team members
  const sendTeamMemberImage = (imagePath: string, res: Response) => {
    // Cache the image response for faster loading (5 minutes cache)
    res.set('Cache-Control', 'public, max-age=300');
    
    // Handle missing file
    if (!fs.existsSync(imagePath)) {
      const defaultImagePath = path.join(__dirname, "../assets/default-profile.svg");
      if (fs.existsSync(defaultImagePath)) {
        return res.sendFile(defaultImagePath);
      }
      return res.status(404).send("Image not found");
    }
    res.sendFile(imagePath);
  };
  
  // Define original team member image routes with caching
  app.get("/api/team-members/gwen", (req: Request, res: Response) => {
    sendTeamMemberImage(path.join(__dirname, "../assets/Gwen.jpg"), res);
  });
  
  app.get("/api/team-members/ivalee", (req: Request, res: Response) => {
    sendTeamMemberImage(path.join(__dirname, "../assets/Ivalee.jpg"), res);
  });
  
  app.get("/api/team-members/portia", (req: Request, res: Response) => {
    sendTeamMemberImage(path.join(__dirname, "../assets/Portia Ebraim.jpg"), res);
  });
  
  app.get("/api/team-members/sam", (req: Request, res: Response) => {
    sendTeamMemberImage(path.join(__dirname, "../assets/Sam (1).jpg"), res);
  });
  
  // Generic route to handle any team member images by ID
  // This is important for handling new members approved from applications
  app.get("/api/team-members/image/:id", async (req: Request, res: Response) => {
    try {
      // Add cache headers for performance (1 hour cache)
      res.set('Cache-Control', 'public, max-age=3600');
      
      // Handle undefined or invalid IDs
      if (!req.params.id || req.params.id === 'undefined') {
        // Send a default image instead of an error
        const defaultImagePath = path.join(__dirname, "../assets/default-profile.svg");
        if (fs.existsSync(defaultImagePath)) {
          return res.sendFile(defaultImagePath);
        }
        return res.status(400).json({ message: "Invalid team member ID" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team member ID" });
      }
      
      // Enhanced logging for debugging
      console.log(`Getting image for team member ID: ${id}`);
      
      const teamMember = await storage.getTeamMember(id);
      if (!teamMember) {
        console.log(`Team member not found with ID: ${id}`);
        // Return default image with cache headers instead of 404
        const defaultImagePath = path.join(__dirname, "../assets/default-profile.svg");
        if (fs.existsSync(defaultImagePath)) {
          return res.sendFile(defaultImagePath);
        }
        return res.status(404).json({ message: "Team member not found" });
      }
      
      console.log(`Team member found. Name: ${teamMember.name}, ImageUrl: ${teamMember.imageUrl}`);
      
      // Special case: look up by name for the original 4 members
      const nameLower = teamMember.name.toLowerCase().trim();
      if (nameLower.includes('gwen')) {
        console.log(`Serving Gwen's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../assets/Gwen.jpg"), res);
      } else if (nameLower.includes('ivalee')) {
        console.log(`Serving Ivalee's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../assets/Ivalee.jpg"), res);
      } else if (nameLower.includes('portia')) {
        console.log(`Serving Portia's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../assets/Portia Ebraim.jpg"), res);
      } else if (nameLower.includes('sam') || nameLower.includes('samantha')) {
        console.log(`Serving Sam's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../assets/Sam (1).jpg"), res);
      } else if (nameLower.includes('karina') || nameLower.includes('delghir')) {
        console.log(`Serving Karina's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../client/src/images/Karina.jpg"), res);
      } else if (nameLower.includes('therrel')) {
        console.log(`Serving Therrel's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../client/src/images/Delghir.jpg"), res);
      } else if (nameLower.includes('nikeia')) {
        console.log(`Serving Nikeia's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../client/src/images/nikeia.jpeg"), res);
      }
      
      // If the imageUrl is an absolute URL, redirect to it
      if (teamMember.imageUrl && (teamMember.imageUrl.startsWith('http://') || teamMember.imageUrl.startsWith('https://'))) {
        console.log(`Redirecting to external URL: ${teamMember.imageUrl}`);
        return res.redirect(teamMember.imageUrl);
      } else if (teamMember.imageUrl && teamMember.imageUrl.trim() !== "") {
        console.log(`Using imageUrl: ${teamMember.imageUrl}`);
        // Check if it's a local file that exists
        const possibleLocalFile = path.join(__dirname, "..", teamMember.imageUrl);
        if (fs.existsSync(possibleLocalFile)) {
          console.log(`Found local file at: ${possibleLocalFile}`);
          return res.sendFile(possibleLocalFile);
        }
        
        // If it's not a local file but still has a path, try to redirect
        console.log(`Redirecting to imageUrl: ${teamMember.imageUrl}`);
        return res.redirect(teamMember.imageUrl);
      }
      
      // If no valid image URL is available, send a default image
      console.log(`No valid image URL found, serving default image`);
      const defaultImagePath = path.join(__dirname, "../assets/default-profile.svg");
      if (fs.existsSync(defaultImagePath)) {
        return res.sendFile(defaultImagePath);
      }
      
      // Last resort - return a 404 if even the default image isn't available
      console.log(`Default image not found, sending 404`);
      res.status(404).json({ message: "Image not available" });
    } catch (error) {
      console.error("Error fetching team member image:", error);
      
      // Even on error, try to return a default image
      const defaultImagePath = path.join(__dirname, "../assets/default-profile.svg");
      if (fs.existsSync(defaultImagePath)) {
        return res.sendFile(defaultImagePath);
      }
      
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
      console.log("Received selfie upload request:", JSON.stringify({
        ...req.body,
        photoUrl: req.body.photoUrl ? req.body.photoUrl.substring(0, 50) + "..." : null
      }));
      
      const parsedBody = selfieFormSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        console.error("Selfie validation error:", parsedBody.error.errors);
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
      
      // Prepare selfie data with the correct fields for our schema
      const selfieData = {
        teamMemberId: parsedBody.data.teamMemberId,
        name: parsedBody.data.name,
        email: parsedBody.data.email,
        phone: parsedBody.data.phone,
        location: parsedBody.data.location,
        // The form and database now both use 'message'
        message: parsedBody.data.message || "",
        photoUrl: parsedBody.data.photoUrl || "",
        submittedAt: new Date()
      };
      
      console.log("Creating new selfie record for team member:", teamMember.name);
      const newSelfie = await storage.createSelfie(selfieData);
      
      console.log("Selfie created successfully with ID:", newSelfie.id);
      res.status(201).json(newSelfie);
    } catch (error) {
      console.error("Selfie upload error:", error);
      res.status(500).json({ message: "Error uploading selfie" });
    }
  });
  
  // Get all applicants for admin dashboard
  app.get("/api/applicants", async (req: Request, res: Response) => {
    try {
      // Check if we want pending only or all applicants
      const showAll = req.query.all === 'true';
      
      let applicants;
      if (showAll) {
        applicants = await storage.getAllApplicants();
      } else {
        applicants = await storage.getPendingApplicants();
      }
      
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

      // Mark the applicant as approved
      await storage.updateApplicantStatus(id, "approved");
      
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
  
  // Reject an applicant
  app.post("/api/applicants/:id/reject", async (req: Request, res: Response) => {
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
      
      // Mark the applicant as rejected
      await storage.updateApplicantStatus(id, "rejected");
      
      res.status(200).json({ 
        success: true, 
        message: "Applicant rejected successfully"
      });
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      res.status(500).json({ message: "Error rejecting applicant" });
    }
  });
  
  // Delete a team member
  app.delete("/api/team-members/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team member ID" });
      }
      
      // Get the team member to verify it exists
      const teamMember = await storage.getTeamMember(id);
      if (!teamMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      // Delete the team member
      await storage.deleteTeamMember(id);
      
      res.status(200).json({ 
        success: true, 
        message: "Team member deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ message: "Error deleting team member" });
    }
  });
  
  // Update a team member - handle file uploads with multer
  app.put("/api/team-members/:id", upload.single('photo'), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team member ID" });
      }
      
      // Get the team member to verify it exists
      const existingMember = await storage.getTeamMember(id);
      if (!existingMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      // Prepare update data from form fields
      const updateData: any = { ...req.body };
      
      // If a file was uploaded, update the imageUrl
      if (req.file) {
        console.log('File uploaded:', req.file.filename);
        // Store the relative path to the file
        updateData.imageUrl = `/attached_assets/${req.file.filename}`;
      }
      
      // Update the team member with the request data
      const updatedMember = await storage.updateTeamMember(id, updateData);
      
      res.status(200).json({ 
        success: true, 
        message: "Team member updated successfully",
        teamMember: updatedMember
      });
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ message: "Error updating team member" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
