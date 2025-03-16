import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamMember, getTeamMemberImageUrl } from "@/lib/teamMembers";
import { UserPlus } from "lucide-react";

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
    <section className="py-12 md:py-16 px-4" aria-labelledby="team-heading">
      <div className="container mx-auto">
        <h2 id="team-heading" className="text-2xl md:text-3xl font-poppins font-bold text-center mb-8 md:mb-12">Our Team of Educators</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, index) => (
              <TeamMemberSkeleton key={index} />
            ))
          ) : (
            // Team member cards with optimized rendering
            teamMembers.map((member, index) => (
              <article key={member.id} className="h-full">
                <Link href={`/team-member/${member.id}`} className="block h-full">
                  <Card className="team-card transition-all duration-300 bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer h-full">
                    <div className="h-64 sm:h-72 md:h-80 overflow-hidden">
                      <img 
                        src={getTeamMemberImage(member)}
                        alt={`${member.name}, ${member.role}`} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ objectPosition: 'center' }}
                        loading={index < 4 ? "eager" : "lazy"} 
                        decoding="async"
                        width="400" 
                        height="450"
                        fetchPriority={index < 4 ? "high" : "auto"}
                        onError={(e) => {
                          // Fallback if the image fails to load
                          e.currentTarget.src = "/attached_assets/Lemonistas card.png";
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-poppins font-semibold text-lg md:text-xl mb-1 truncate">{member.name}</h3>
                      <div className="flex items-center mt-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#FB4694] mr-2" aria-hidden="true"></span>
                        <span className="text-sm">{member.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </article>
            ))
          )}

          {/* Join Our Team card with accessibility improvements */}
          <div className="h-full">
            <Card 
              className="team-card bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-full min-h-[300px] cursor-pointer hover:bg-gray-50 transition-colors duration-300"
              onClick={onJoinClick}
              role="button"
              tabIndex={0}
              aria-label="Join Our Team"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onJoinClick();
                }
              }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
              </div>
              <h3 className="font-poppins font-semibold text-lg md:text-xl text-gray-500 mb-2">Join Our Team</h3>
              <p className="text-center text-gray-400 text-sm">This could be you! Apply to become a Lemonista today.</p>
            </Card>
          </div>
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