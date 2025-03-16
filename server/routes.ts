import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { applicantFormSchema, selfieFormSchema } from "@shared/schema";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import upload from './utils/upload';
import { login, logout, checkAuthStatus, isAuthenticated } from "./auth";

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
  // Use a helper function to handle image requests for known team members with performance optimization
  const sendTeamMemberImage = (imagePath: string, res: Response, noCache: boolean = false, req?: Request) => {
    // Add ETag support for better caching
    const stat = fs.existsSync(imagePath) ? fs.statSync(imagePath) : null;
    const etag = stat ? `W/"${stat.size}-${Date.parse(stat.mtime.toString())}"` : null;
    
    // Set proper content type based on file extension
    const ext = path.extname(imagePath).toLowerCase();
    const contentTypeMap: {[key: string]: string} = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp'
    };
    
    if (etag && req) {
      res.setHeader('ETag', etag);
      
      // Check if browser sent If-None-Match header matching our ETag
      const ifNoneMatch = req.headers['if-none-match'];
      if (ifNoneMatch === etag) {
        // Return 304 Not Modified if ETag matches
        return res.status(304).end();
      }
    }
    
    if (noCache) {
      // No caching for special images like Monisha's that get updated frequently
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else {
      // Cache other images for faster loading (1 day cache, was 5 minutes)
      res.set('Cache-Control', 'public, max-age=86400');
    }
    
    // Set proper content type for better browser rendering
    if (ext && contentTypeMap[ext]) {
      res.setHeader('Content-Type', contentTypeMap[ext]);
    }
    
    // Handle missing file
    if (!fs.existsSync(imagePath)) {
      const defaultImagePath = path.join(__dirname, "../assets/default-profile.svg");
      if (fs.existsSync(defaultImagePath)) {
        // Set proper content type for SVG
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.sendFile(defaultImagePath);
      }
      return res.status(404).send("Image not found");
    }
    
    res.sendFile(imagePath);
  };
  
  // Define original team member image routes with caching
  app.get("/api/team-members/gwen", (req: Request, res: Response) => {
    sendTeamMemberImage(path.join(__dirname, "../assets/Gwen.jpg"), res, false, req);
  });
  
  app.get("/api/team-members/ivalee", (req: Request, res: Response) => {
    sendTeamMemberImage(path.join(__dirname, "../assets/Ivalee.jpg"), res, false, req);
  });
  
  app.get("/api/team-members/portia", (req: Request, res: Response) => {
    sendTeamMemberImage(path.join(__dirname, "../assets/Portia Ebraim.jpg"), res, false, req);
  });
  
  app.get("/api/team-members/sam", (req: Request, res: Response) => {
    sendTeamMemberImage(path.join(__dirname, "../assets/Sam (1).jpg"), res, false, req);
  });
  
  // Generic route to handle any team member images by ID
  // This is important for handling new members approved from applications
  app.get("/api/team-members/image/:id", async (req: Request, res: Response) => {
    try {
      // Use caching for improved performance (30 days for better performance)
      // Only disable cache for specific team members that need frequent updates
      const teamMembersWithoutCache = [10]; // Monisha's ID is 10 based on logs
      
      // Handle undefined or invalid IDs
      if (!req.params.id || req.params.id === 'undefined') {
        // Send a default image instead of an error
        const defaultImagePath = path.join(__dirname, "../assets/default-profile.svg");
        if (fs.existsSync(defaultImagePath)) {
          res.set('Cache-Control', 'public, max-age=2592000'); // 30 days
          return res.sendFile(defaultImagePath);
        }
        return res.status(400).json({ message: "Invalid team member ID" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid team member ID" });
      }
      
      const teamMember = await storage.getTeamMember(id);
      if (!teamMember) {
        // Return default image with cache headers instead of 404
        const defaultImagePath = path.join(__dirname, "../attached_assets/Lemonistas card.png");
        if (fs.existsSync(defaultImagePath)) {
          res.set('Cache-Control', 'public, max-age=2592000'); // 30 days
          return res.sendFile(defaultImagePath);
        }
        return res.status(404).json({ message: "Team member not found" });
      }
      
      // Apply appropriate cache headers based on team member ID
      if (teamMembersWithoutCache.includes(id)) {
        // No cache for team members who need frequent updates
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
      } else {
        // Cache for 7 days for better performance
        res.set('Cache-Control', 'public, max-age=604800'); 
      }
      
      console.log(`Team member found. Name: ${teamMember.name}, ImageUrl: ${teamMember.imageUrl}`);
      
      // Special case: look up by name for the original 4 members
      const nameLower = teamMember.name.toLowerCase().trim();
      console.log(`DEBUG - Team member name (lowercase): "${nameLower}", ID: ${id}`);
      if (nameLower.includes('gwen')) {
        console.log(`Serving Gwen's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../assets/Gwen.jpg"), res, false, req);
      } else if (nameLower.includes('ivalee')) {
        console.log(`Serving Ivalee's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../assets/Ivalee.jpg"), res, false, req);
      } else if (nameLower.includes('portia')) {
        console.log(`Serving Portia's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../assets/Portia Ebraim.jpg"), res, false, req);
      } else if (nameLower.includes('sam') || nameLower.includes('samantha')) {
        console.log(`Serving Sam's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../assets/Sam (1).jpg"), res, false, req);
      } else if (nameLower.includes('karina')) {
        console.log(`Serving Karina's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../client/src/images/Karina.jpg"), res, false, req);
      } else if (nameLower === 'therrel' || nameLower.includes('delghir')) {
        console.log(`Serving Delghir's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../client/src/images/Delghir.jpg"), res, false, req);
      } else if (nameLower.includes('nikeia')) {
        console.log(`Serving Nikeia's image for team member ID: ${id}`);
        return sendTeamMemberImage(path.join(__dirname, "../client/src/images/nikeia.jpeg"), res, false, req);
      } else if (nameLower.includes('monisha')) {
        console.log(`Serving Monisha's image for team member ID: ${id}`);
        
        // Try to get the most recent uploaded image from attached_assets
        // First check the database for the image URL
        if (teamMember.imageUrl && teamMember.imageUrl.includes('attached_assets')) {
          const monishaImagePath = path.join(__dirname, '..', teamMember.imageUrl);
          console.log(`Trying to serve Monisha's image from DB path: ${monishaImagePath}`);
          
          if (fs.existsSync(monishaImagePath)) {
            return sendTeamMemberImage(monishaImagePath, res, true, req); // true = no cache
          }
        }
        
        // Fallback to the latest known upload
        const possibleImagePath = `/attached_assets/team-member-1742146750574-55066934.png`;
        const backupImagePath = path.join(__dirname, '..', possibleImagePath);
        if (fs.existsSync(backupImagePath)) {
          console.log(`Falling back to known Monisha image: ${backupImagePath}`);
          return sendTeamMemberImage(backupImagePath, res, true, req); // true = no cache
        }
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
          
          // If this is an uploaded file, disable caching
          const shouldDisableCache = teamMember.imageUrl.includes('attached_assets') && 
                                    teamMember.imageUrl.includes('team-member-');
          
          if (shouldDisableCache) {
            console.log('Serving uploaded file with no-cache headers');
            return sendTeamMemberImage(possibleLocalFile, res, true, req); // No cache
          } else {
            return res.sendFile(possibleLocalFile);
          }
        }
        
        // If it's not a local file but still has a path, try to redirect
        console.log(`Redirecting to imageUrl: ${teamMember.imageUrl}`);
        return res.redirect(teamMember.imageUrl);
      }
      
      // If no valid image URL is available, send a default image
      console.log(`No valid image URL found, serving default image`);
      const defaultImagePath = path.join(__dirname, "../attached_assets/Lemonistas card.png");
      if (fs.existsSync(defaultImagePath)) {
        return res.sendFile(defaultImagePath);
      }
      
      // Last resort - return a 404 if even the default image isn't available
      console.log(`Default image not found, sending 404`);
      res.status(404).json({ message: "Image not available" });
    } catch (error) {
      console.error("Error fetching team member image:", error);
      
      // Even on error, try to return a default image
      const defaultImagePath = path.join(__dirname, "../attached_assets/Lemonistas card.png");
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
        // Handle both message and notes fields (supporting both form variants)
        message: parsedBody.data.message || parsedBody.data.notes || "",
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
  
  // Get all applicants and selfies are now protected routes - see bottom of file
  
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

  // Approve an applicant to become a team member - protected
  app.post("/api/applicants/:id/approve", isAuthenticated, async (req: Request, res: Response) => {
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
        imageUrl: applicant.photoUrl || "/attached_assets/Lemonistas card.png"
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
  
  // Reject an applicant - protected
  app.post("/api/applicants/:id/reject", isAuthenticated, async (req: Request, res: Response) => {
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
  
  // Delete a team member - protected
  app.delete("/api/team-members/:id", isAuthenticated, async (req: Request, res: Response) => {
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
  
  // Delete a selfie (conversation) - protected
  app.delete("/api/selfies/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid selfie ID" });
      }
      
      // Get the selfie to verify it exists
      const selfie = await storage.getSelfie(id);
      if (!selfie) {
        return res.status(404).json({ message: "Selfie not found" });
      }
      
      // Delete the selfie
      await storage.deleteSelfie(id);
      
      res.status(200).json({ 
        success: true, 
        message: "Conversation log deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting selfie:", error);
      res.status(500).json({ message: "Error deleting conversation log" });
    }
  });
  
  // Update a team member - handle file uploads with multer - protected
  app.put("/api/team-members/:id", isAuthenticated, upload.single('photo'), async (req: Request, res: Response) => {
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
      
      // Handle the imageUrl field if present
      if (req.body.imageUrl) {
        console.log('Using provided image URL:', req.body.imageUrl);
        updateData.imageUrl = req.body.imageUrl;
      }
      
      // If a file was uploaded, it takes precedence over imageUrl field
      if (req.file) {
        console.log('File uploaded:', req.file.filename);
        // Store the relative path to the file
        updateData.imageUrl = `/attached_assets/${req.file.filename}`;
      }
      
      console.log('Updating team member with data:', updateData);
      
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

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/status", checkAuthStatus);
  
  // Protected admin routes - require authentication
  app.get("/api/applicants", isAuthenticated, async (req: Request, res: Response) => {
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
  
  // Get all selfies for admin dashboard - protected
  app.get("/api/selfies", isAuthenticated, async (req: Request, res: Response) => {
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
