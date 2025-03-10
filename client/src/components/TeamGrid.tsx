import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamMember, getTeamMemberImageUrl } from "@/lib/teamMembers";
import { UserPlus } from "lucide-react";

// Helper function to get the proper image for a team member
function getTeamMemberImage(member: TeamMember): string {
  // For the original 4 members (gwen, ivalee, portia, sam), use name-based URLs
  const originalMembers = ['gwen', 'ivalee', 'portia', 'sam'];
  const nameLower = member.name.toLowerCase();
  
  if (originalMembers.includes(nameLower)) {
    return `/api/team-members/${nameLower}`;
  }
  
  // For approved members with direct URLs, use those
  if (member.imageUrl && (member.imageUrl.startsWith('http://') || member.imageUrl.startsWith('https://'))) {
    return member.imageUrl;
  }
  
  // Fallback to the image helper for any other case
  return getTeamMemberImageUrl(member);
}

interface TeamGridProps {
  teamMembers: TeamMember[];
  isLoading: boolean;
  onJoinClick: () => void;
}

export default function TeamGrid({ teamMembers, isLoading, onJoinClick }: TeamGridProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-poppins font-bold text-center mb-12">Our Team of Educators</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, index) => (
              <TeamMemberSkeleton key={index} />
            ))
          ) : (
            // Team member cards
            teamMembers.map((member) => (
              <div key={member.id} className="block">
                <Link href={`/team-member/${member.id}`}>
                  <Card className="team-card transition-all duration-300 bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer h-full">
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={getTeamMemberImage(member)}
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          // Fallback if the image fails to load
                          e.currentTarget.src = "https://placehold.co/400x400/f8f6f4/FB4694?text=L&font=poppins";
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-poppins font-semibold text-xl mb-1">{member.name}</h3>
                      <p className="text-sm text-[#7D7B7B] mb-2">{member.role}</p>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#7D7B7B] mr-2"></span>
                        <span className="text-sm">{member.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))
          )}

          {/* Empty spots (4 placeholders) */}
          {Array(4).fill(0).map((_, index) => (
            <Card 
              key={`empty-${index}`} 
              className="team-card bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-80"
              onClick={onJoinClick}
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-poppins font-semibold text-xl text-gray-400 mb-2">Join Our Team</h3>
              <p className="text-center text-gray-400 text-sm">This could be you! Apply to become a Lemonista today.</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamMemberSkeleton() {
  return (
    <Card className="rounded-xl shadow-md overflow-hidden h-full">
      <Skeleton className="h-64 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
}