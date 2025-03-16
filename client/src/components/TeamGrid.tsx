import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamMember, getTeamMemberImageUrl } from "@/lib/teamMembers";
import { UserPlus, ArrowRight } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

// Use the centralized image URL function
const getTeamMemberImage = getTeamMemberImageUrl;

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
            // Team member cards with hover effect
            teamMembers.map((member) => (
              <div key={member.id} className="block">
                <HoverCard openDelay={200} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <div className="relative group">
                      <Link href={`/team-member/${member.id}`}>
                        <Card className="team-card transition-all duration-300 bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer h-full">
                          <div className="h-80 overflow-hidden">
                            <img 
                              src={getTeamMemberImage(member)}
                              alt={member.name} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                // Fallback if the image fails to load
                                e.currentTarget.src = "/attached_assets/Lemonistas card.png";
                              }}
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-poppins font-semibold text-xl mb-1">{member.name}</h3>
                            <div className="flex items-center mt-2">
                              <span className="inline-block w-2 h-2 rounded-full bg-[#FB4694] mr-2"></span>
                              <span className="text-sm">{member.location}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-[#FB4694] text-white text-xs rounded-full px-2 py-1 font-medium hover-indicator">
                          Hover for Info
                        </div>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-0 shadow-lg rounded-xl border border-gray-100 bg-white animation-fade-in hover-card-content">
                    <div className="flex flex-col">
                      <div className="p-6 pb-3">
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-[#FB4694]/20">
                            <img 
                              src={getTeamMemberImage(member)} 
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/attached_assets/Lemonistas card.png";
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{member.name}</h4>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-4 mb-2">
                          {member.bio || `${member.name} is a dedicated educator with the Lemonistas team focused on breast health education in the Bahamas.`}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#FB4694] mr-2"></span>
                          {member.location}
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between items-center rounded-b-xl">
                        <span className="text-xs text-gray-500">Joined: {member.joined || 'The Lemonistas'}</span>
                        <Link href={`/team-member/${member.id}`}>
                          <Button variant="link" size="sm" className="text-xs p-0 h-auto flex items-center text-[#FB4694]">
                            View Profile <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            ))
          )}

          {/* Single "Join Our Team" placeholder */}
          <Card 
            className="team-card bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-80"
            onClick={onJoinClick}
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-poppins font-semibold text-xl text-gray-400 mb-2">Join Our Team</h3>
            <p className="text-center text-gray-400 text-sm">This could be you! Apply to become a Lemonista today.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}

function TeamMemberSkeleton() {
  return (
    <Card className="rounded-xl shadow-md overflow-hidden h-full">
      <Skeleton className="h-80 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-4 w-20 mt-2" />
      </CardContent>
    </Card>
  );
}