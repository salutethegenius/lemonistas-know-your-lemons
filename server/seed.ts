import { db } from "./db";
import { teamMembers, type InsertTeamMember } from "@shared/schema";

async function seedTeamMembers() {
  // Check if team members already exist
  const existingMembers = await db.select().from(teamMembers);
  if (existingMembers.length > 0) {
    console.log("Team members already exist in the database, skipping seed.");
    return;
  }

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

  console.log("Seeding team members...");
  await db.insert(teamMembers).values(initialMembers);
  console.log("Team members seeded successfully!");
}

export { seedTeamMembers };