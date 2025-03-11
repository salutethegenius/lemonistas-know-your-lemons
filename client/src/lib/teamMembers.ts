export interface TeamMember {
  id: number;
  name: string;
  role: string;
  location: string;
  bio: string;
  focus: string;
  joined: string;
  imageUrl: string;
}

// Helper function to get full image URL for a team member
export function getTeamMemberImageUrl(member: TeamMember | null | undefined): string {
  // Handle undefined member case
  if (!member) {
    return '';
  }
  
  // Original 4 members use API endpoints
  if (member.name) {
    const nameLower = member.name.toLowerCase();
    
    // Direct mapping for original members
    if (nameLower === 'gwen') {
      return "/api/team-members/gwen";
    } else if (nameLower === 'ivalee') {
      return "/api/team-members/ivalee";
    } else if (nameLower === 'portia') {
      return "/api/team-members/portia";
    } else if (nameLower === 'sam') {
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
  
  // Fallback to placeholder
  return "https://placehold.co/400x400/f8f6f4/FB4694?text=L&font=poppins";
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
