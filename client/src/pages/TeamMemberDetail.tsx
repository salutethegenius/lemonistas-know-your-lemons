import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Linkedin, Mail, Share2, Twitter, Facebook, Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamMember } from "@/lib/teamMembers";
import Footer from "@/components/Footer";
import { useState } from "react";
import SelfieUploadModal from "@/components/SelfieUploadModal";
import SuccessModal from "@/components/SuccessModal";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

// Interface for Selfies linked to team members
interface Selfie {
  id: number;
  location: string;
  caption: string;
  teamMemberId: number;
  createdAt: string;
  photoUrl: string | null;
}

// Function to generate the appropriate image URL for a team member
function getTeamMemberImage(member: TeamMember | null | undefined): string {
  if (!member) {
    return "https://placehold.co/400x400/f8f6f4/FB4694?text=L&font=poppins";
  }
  
  // Original 4 members (gwen, ivalee, portia, sam) have name-based URLs
  const originalMembers = ['gwen', 'ivalee', 'portia', 'sam'];
  
  // Ensure member.name exists before trying to use it
  if (member.name) {
    const nameLower = member.name.toLowerCase();
    
    if (originalMembers.includes(nameLower)) {
      return `/api/team-members/${nameLower}`;
    }
  }
  
  // For all other cases, use the image by ID endpoint if member.id exists
  if (member.id) {
    return `/api/team-members/image/${member.id}`;
  }
  
  // Fallback if member.id doesn't exist
  return "https://placehold.co/400x400/f8f6f4/FB4694?text=L&font=poppins";
}

export default function TeamMemberDetail() {
  const [match, params] = useRoute("/team-member/:id");
  const memberId = params?.id ? parseInt(params.id) : null;
  const [isSelfieModalOpen, setIsSelfieModalOpen] = useState(false);
  const [isSelfieSuccessModalOpen, setIsSelfieSuccessModalOpen] = useState(false);

  // Fetch all team members and find the specific one by ID
  const { data: allMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  // Use a dedicated query to get the member details if needed
  const { data: memberData } = useQuery<TeamMember>({
    queryKey: ["/api/team-members", memberId],
    enabled: memberId !== null,
  });

  // Fetch selfies for this team member
  const { data: memberSelfies = [] } = useQuery<Selfie[]>({
    queryKey: ["/api/team-members", memberId, "selfies"],
    enabled: memberId !== null,
  });

  // Find the specific member by ID (either from the list or direct query)
  const member = memberData || allMembers?.find(m => m.id === memberId);

  const handleOpenSelfieModal = () => {
    setIsSelfieModalOpen(true);
  };

  const handleCloseSelfieModal = () => {
    setIsSelfieModalOpen(false);
  };

  const handleSelfieSuccess = () => {
    setIsSelfieModalOpen(false);
    setIsSelfieSuccessModalOpen(true);
  };

  const handleCloseSelfieSuccessModal = () => {
    setIsSelfieSuccessModalOpen(false);
  };

  // Log info about the member for debugging
  const logMemberInfo = (member: TeamMember | undefined | null): void => {
    if (!member) {
      console.log("Member is undefined");
      return;
    }
    console.log("Member data:", JSON.stringify(member, null, 2));
  };

  // Function to handle sharing
  const shareProfile = (platform: string) => {
    if (!member) return;
    
    const url = window.location.href;
    const text = `Check out ${member.name}, ${member.role} at Lemonistas!`;
    let shareUrl = '';

    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

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

  // Log member data for debugging
  logMemberInfo(member);

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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full" onClick={() => shareProfile('linkedin')}>
                        <Share2 size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/5">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                    <img 
                      src={getTeamMemberImage(member)}
                      alt={member.name} 
                      className="w-full h-auto object-cover aspect-square"
                      onError={(e) => {
                        // Fallback if the image fails to load
                        e.currentTarget.src = "https://placehold.co/400x400/f8f6f4/FB4694?text=L&font=poppins";
                      }}
                    />
                  </div>

                  <div className="mt-6">
                    <h4 className="font-poppins font-semibold mb-4">Share Profile</h4>
                    <div className="flex gap-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="default" 
                              size="icon" 
                              className="rounded-full bg-[#FB4694] hover:bg-[#FB4694]/80"
                              onClick={() => shareProfile('linkedin')}
                            >
                              <Linkedin size={18} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share on LinkedIn</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="default" 
                              size="icon" 
                              className="rounded-full bg-[#FB4694] hover:bg-[#FB4694]/80"
                              onClick={() => shareProfile('twitter')}
                            >
                              <Twitter size={18} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share on Twitter</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="default" 
                              size="icon" 
                              className="rounded-full bg-[#FB4694] hover:bg-[#FB4694]/80"
                              onClick={() => shareProfile('facebook')}
                            >
                              <Facebook size={18} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share on Facebook</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="default" 
                              size="icon" 
                              className="rounded-full bg-[#FB4694] hover:bg-[#FB4694]/80"
                              onClick={() => shareProfile('email')}
                            >
                              <Mail size={18} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share via Email</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Upload Selfie Button */}
                  <div className="mt-6">
                    <Button 
                      onClick={handleOpenSelfieModal} 
                      className="w-full flex items-center justify-center space-x-2 bg-[#FB4694] hover:bg-[#FB4694]/90 text-white py-3 rounded-xl"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      <span>Upload Selfie with {member.name || 'Team Member'}</span>
                    </Button>
                  </div>
                </div>

                <div className="md:w-3/5">
                  <div className="mb-6">
                    <h3 className="text-xl font-poppins font-semibold mb-2">{member.role}</h3>
                    <div className="flex items-center mb-4">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#FB4694] mr-2"></span>
                      <span className="text-[#7D7B7B]">{member.location}</span>
                    </div>
                    <p className="text-[#292929] text-lg leading-relaxed">{member.bio}</p>
                  </div>

                  {/* Connect section */}
                  <div className="mt-8">
                    <h4 className="font-poppins font-semibold mb-4">Connect</h4>
                    <Button variant="outline" className="mr-3 bg-white">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" className="bg-white">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                  
                  {/* Selfies section - show only if there are selfies */}
                  {memberSelfies && memberSelfies.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-poppins font-semibold mb-4">Community Selfies</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {memberSelfies.map((selfie) => (
                          <Card key={selfie.id} className="overflow-hidden">
                            <div className="h-48 overflow-hidden">
                              {selfie.photoUrl ? (
                                <img 
                                  src={selfie.photoUrl} 
                                  alt={`Selfie with ${member.name}`} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/400x400/f8f6f4/FB4694?text=Selfie&font=poppins";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <Camera className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <CardContent className="p-3">
                              <p className="text-sm font-medium mb-1">{selfie.caption}</p>
                              <p className="text-xs text-gray-500 mb-1">{selfie.location}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(selfie.createdAt).toLocaleDateString()}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />

      {/* Selfie Upload Modal */}
      {isSelfieModalOpen && member && member.id && member.name && (
        <SelfieUploadModal 
          onClose={handleCloseSelfieModal} 
          onSuccess={handleSelfieSuccess}
          teamMemberId={member.id}
          teamMemberName={member.name}
        />
      )}

      {/* Success Modal */}
      {isSelfieSuccessModalOpen && (
        <SuccessModal onClose={handleCloseSelfieSuccessModal} />
      )}
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
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/5">
                  <Skeleton className="h-80 w-full rounded-xl aspect-square" />

                  <div className="mt-6">
                    <Skeleton className="h-8 w-32 mb-4" />
                    <div className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="md:w-3/5">
                  <div className="mb-6">
                    <Skeleton className="h-8 w-36 mb-2" />
                    <div className="flex items-center mb-4">
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>

                  <div className="mt-8">
                    <Skeleton className="h-8 w-32 mb-4" />
                    <div className="flex gap-3">
                      <Skeleton className="h-10 w-24 rounded-md" />
                      <Skeleton className="h-10 w-28 rounded-md" />
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