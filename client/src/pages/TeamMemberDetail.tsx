import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Linkedin, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamMember } from "@/lib/teamMembers";
import Footer from "@/components/Footer";

export default function TeamMemberDetail() {
  const [match, params] = useRoute("/team-member/:id");
  const memberId = params?.id ? parseInt(params.id) : null;

  const { data: member, isLoading } = useQuery<TeamMember>({
    queryKey: ["/api/team-members", memberId],
    enabled: !!memberId,
  });

  if (isLoading) {
    return <TeamMemberDetailSkeleton />;
  }

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-12 flex-grow">
          <Link href="/">
            <Button variant="outline" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team
            </Button>
          </Link>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-poppins font-bold mb-4">Team Member Not Found</h2>
              <p className="text-gray-600 mb-6">The team member you're looking for doesn't exist or has been removed.</p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F4]">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team
          </Button>
        </Link>

        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl md:text-3xl font-poppins font-bold">{member.name}</h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="rounded-xl overflow-hidden">
                    <img src={member.imageUrl} alt={member.name} className="w-full h-auto object-cover" />
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="mb-6">
                    <h3 className="text-xl font-poppins font-semibold mb-2">{member.role}</h3>
                    <div className="flex items-center mb-4">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#FB4694] mr-2"></span>
                      <span className="text-[#7D7B7B]">{member.location}</span>
                    </div>
                    <p className="text-[#292929]">{member.bio}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-[#7D7B7B] mb-1">Areas of Focus</p>
                      <p className="font-medium">{member.focus}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-[#7D7B7B] mb-1">Joined</p>
                      <p className="font-medium">{member.joined}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="font-poppins font-semibold mb-4">Connect</h4>
                    <div className="flex gap-3">
                      <Button variant="default" size="icon" className="rounded-full bg-[#FB4694] hover:bg-[#FB4694]/80">
                        <Linkedin size={18} />
                      </Button>
                      <Button variant="default" size="icon" className="rounded-full bg-[#FB4694] hover:bg-[#FB4694]/80">
                        <Mail size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

function TeamMemberDetailSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F4]">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team
          </Button>
        </Link>

        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <Skeleton className="h-10 w-48" />
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <Skeleton className="h-80 w-full rounded-xl" />
                </div>
                
                <div className="md:w-2/3">
                  <div className="mb-6">
                    <Skeleton className="h-8 w-36 mb-2" />
                    <div className="flex items-center mb-4">
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                  
                  <Skeleton className="h-8 w-32 mb-4" />
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
