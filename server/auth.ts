import { InsertUser } from "@shared/schema";
import { storage } from "./storage";
import { Request, Response, NextFunction } from "express";
import 'express-session';

// Extend Express Request session type
declare module 'express-session' {
  interface SessionData {
    authenticated?: boolean;
    user?: { username: string };
  }
}

// Hard-coded admin credentials - in a real app, we would use a proper authentication system
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "watsonfpo";

// Middleware to check if user is authenticated
export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const session = req.session as any;
  
  if (session && session.authenticated) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
}

// Login function
export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  // Check against our hard-coded credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set session data
    (req.session as any).authenticated = true;
    (req.session as any).user = { username };
    
    return res.status(200).json({ 
      success: true,
      message: "Login successful",
      user: { username }
    });
  }
  
  // Try to find user in database as fallback
  try {
    const user = await storage.getUserByUsername(username);
    
    if (user && user.password === password) {
      // Set session data
      (req.session as any).authenticated = true;
      (req.session as any).user = { username: user.username };
      
      return res.status(200).json({ 
        success: true,
        message: "Login successful",
        user: { username: user.username }
      });
    }
  } catch (error) {
    console.error("Database login error:", error);
  }
  
  // If we get here, authentication failed
  return res.status(401).json({ message: "Invalid username or password" });
}

// Logout function
export async function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
}

// Check authentication status
export async function checkAuthStatus(req: Request, res: Response) {
  const session = req.session as any;
  
  if (session && session.authenticated) {
    return res.status(200).json({ authenticated: true, user: session.user });
  }
  
  return res.status(200).json({ authenticated: false });
}

// Create initial admin user in database if needed
export async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await storage.getUserByUsername(ADMIN_USERNAME);
    
    if (!existingUser) {
      // Create admin user
      const user: InsertUser = {
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD
      };
      
      await storage.createUser(user);
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}