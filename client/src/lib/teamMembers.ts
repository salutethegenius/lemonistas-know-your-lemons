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
export function getTeamMemberImageUrl(member: TeamMember): string {
  // Ensure the imageUrl starts with /api/
  if (member.imageUrl.startsWith('/api/')) {
    return member.imageUrl;
  }
  // Otherwise, construct the URL using the member's name
  return `/api/team-members/${member.name.toLowerCase()}`;
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
