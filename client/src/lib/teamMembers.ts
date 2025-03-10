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
  
  // Original 4 members (gwen, ivalee, portia, sam) have name-based URLs
  const originalMembers = ['gwen', 'ivalee', 'portia', 'sam'];
  const nameLower = member.name.toLowerCase();
  
  if (originalMembers.includes(nameLower)) {
    return `/api/team-members/${nameLower}`;
  }
  
  // If member has a direct URL (http/https), use it directly
  if (member.imageUrl && (member.imageUrl.startsWith('http://') || member.imageUrl.startsWith('https://'))) {
    return member.imageUrl;
  }
  
  // For all other cases, use the image by ID endpoint
  return `/api/team-members/image/${member.id}`;
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
