export interface TeamMember {
  id: number;
  name: string;
  role: string;
  location: string;
  bio: string;
  focus: string;
  joined: string;
  imageUrl: string;
  email?: string;
  linkedin?: string;
}

// Helper function to get full image URL for a team member
export function getTeamMemberImageUrl(member: TeamMember | null | undefined): string {
  // Handle undefined member case
  if (!member) {
    return "/attached_assets/Lemonistas card.png";
  }
  
  // Original 4 members have direct name-based endpoints
  if (member.name) {
    // Case-insensitive check for original team members
    const nameLower = member.name.toLowerCase().trim();
    
    if (nameLower.includes('gwen')) {
      return "/api/team-members/gwen";
    } else if (nameLower.includes('ivalee')) {
      return "/api/team-members/ivalee";
    } else if (nameLower.includes('portia')) {
      return "/api/team-members/portia";
    } else if (nameLower.includes('sam')) {
      return "/api/team-members/sam";
    }
  }
  
  // If member has a direct URL (http/https), use it directly
  if (member.imageUrl && (member.imageUrl.startsWith('http://') || member.imageUrl.startsWith('https://'))) {
    return member.imageUrl;
  }
  
  // For all other members, use image by ID endpoint
  if (member.id) {
    return `/api/team-members/image/${member.id}`;
  }
  
  // Fallback to Lemonistas card
  return "/attached_assets/Lemonistas card.png";
}

export interface ApplicantFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  whyJoin: string;
  photoUrl?: string | null;
}

export const LOCATIONS = [
  "Nassau",
  "Grand Bahama",
  "Abaco",
  "Eleuthera",
  "Exuma",
  "Andros",
  "Bimini",
  "Cat Island",
  "Other"
];
