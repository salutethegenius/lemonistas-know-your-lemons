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
  
  // Handle original 4 members with direct image paths from the images folder
  if (member.name) {
    const nameLower = member.name.toLowerCase();
    
    // Direct mapping for original members
    if (nameLower === 'gwen') {
      return "/src/images/Gwen.jpg";
    } else if (nameLower === 'ivalee') {
      return "/src/images/Ivalee.jpg";
    } else if (nameLower === 'portia') {
      return "/src/images/Portia Ebraim.jpg";
    } else if (nameLower === 'sam') {
      return "/src/images/Sam (1).jpg";
    }
  }
  
  // If member has a direct URL (http/https), use it directly
  if (member.imageUrl && (member.imageUrl.startsWith('http://') || member.imageUrl.startsWith('https://'))) {
    return member.imageUrl;
  } else if (member.imageUrl) {
    // Use any provided imageUrl
    return member.imageUrl;
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
