import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Linkedin, Mail, Share2, Twitter, Facebook, Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamMember, getTeamMemberImageUrl } from "@/lib/teamMembers";
import Footer from "@/components/Footer";
import { useState } from "react";
import ConversationLogModal from "@/components/ConversationLogModal";
import SuccessModal from "@/components/SuccessModal";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

// Fetch function for React Query
const fetchTeamMembers = async () => {
  const response = await fetch("/api/team-members");
  if (!response.ok) throw new Error("Failed to fetch team members");
  return response.json();
};

const fetchTeamMember = async (id: number) => {
  const response = await fetch(`/api/team-members/${id}`);
  if (!response.ok) throw new Error("Failed to fetch team member");
  return response.json();
};

// Share profile component
interface ShareButtonProps {
  platform: string;
  onClick: () => void;
  children: React.ReactNode;
}

const ShareButton = ({ platform, onClick, children }: ShareButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="default" 
          size="icon" 
          className="rounded-full bg-[#FB4694] hover:bg-[#FB4694]/80"
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share on {platform}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default function TeamMemberDetail() {
  const [match, params] = useRoute("/team-member/:id");
  const memberId = params?.id ? parseInt(params.id) : null;
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
  const [isConversationSuccessModalOpen, setIsConversationSuccessModalOpen] = useState(false);

  // Fetch all team members
  const { 
    data: allMembers, 
    isLoading: isLoadingMembers,
    error: membersError
  } = useQuery({
    queryKey: ["/api/team-members"],
    queryFn: fetchTeamMembers,
    enabled: !memberId // Only fetch all if no specific ID
  });

  // Fetch specific team member
  const { 
    data: memberData, 
    isLoading: isLoadingMemberData,
    error: memberError 
  } = useQuery({
    queryKey: ["/api/team-members", memberId],
    queryFn: () => memberId !== null ? fetchTeamMember(memberId) : Promise.resolve(null),
    enabled: memberId !== null,
  });

  // Determine if any data is still loading
  const isLoading = isLoadingMembers || isLoadingMemberData;
  const error = membersError || memberError;

  // Find the specific member by ID (either from direct query or from the list)
  const member = memberData || (Array.isArray(allMembers) ? allMembers.find((m: TeamMember) => m.id === memberId) : undefined);

  const handleOpenConversationModal = () => setIsConversationModalOpen(true);
  const handleCloseConversationModal = () => setIsConversationModalOpen(false);
  const handleConversationSuccess = () => {
    setIsConversationModalOpen(false);
    setIsConversationSuccessModalOpen(true);
  };
  const handleCloseConversationSuccessModal = () => setIsConversationSuccessModalOpen(false);

  // Function to handle sharing
  const shareProfile = (platform: string) => {
    if (!member) return;

    const url = window.location.href;
    const text = `Check out ${member.name} at Lemonistas!`;
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

  if (error) {
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
              <h2 className="text-2xl font-poppins font-bold mb-4">Error Loading Team Member</h2>
              <p className="text-gray-600 mb-6">There was a problem loading the team member data.</p>
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
              {/* Empty header now, will move name to below the image */}

              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/5">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                    <img 
                      src={getTeamMemberImageUrl(member)}
                      alt={member.name} 
                      className="aspect-[3/4] img-centered"
                      style={{ minHeight: '300px' }}
                      onError={(e) => {
                        e.currentTarget.src = "/attached_assets/Lemonistas card.png";
                      }}
                    />
                  </div>

                  <div className="mt-6">
                    <h2 className="text-2xl md:text-3xl font-poppins font-bold mb-4">{member.name}</h2>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex gap-3">
                        {member.email && (
                          <ShareButton platform="Email" onClick={() => window.open(`mailto:${member.email}`, '_blank')}>
                            <Mail size={18} />
                          </ShareButton>
                        )}
                        {member.linkedin && (
                          <ShareButton platform="LinkedIn" onClick={() => window.open(member.linkedin, '_blank')}>
                            <Linkedin size={18} />
                          </ShareButton>
                        )}
                        <ShareButton platform="LinkedIn" onClick={() => shareProfile('linkedin')}>
                          <Linkedin size={18} />
                        </ShareButton>
                        <ShareButton platform="Twitter" onClick={() => shareProfile('twitter')}>
                          <Twitter size={18} />
                        </ShareButton>
                        <ShareButton platform="Facebook" onClick={() => shareProfile('facebook')}>
                          <Facebook size={18} />
                        </ShareButton>
                        <ShareButton platform="Email" onClick={() => shareProfile('email')}>
                          <Mail size={18} />
                        </ShareButton>
                      </div>
                    </div>
                  </div>

                  {/* Log Conversation Button */}
                  <div className="mt-6">
                    <Button 
                      onClick={handleOpenConversationModal} 
                      className="w-full flex items-center justify-center space-x-2 bg-[#FB4694] hover:bg-[#FB4694]/90 text-white py-3 rounded-xl"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      <span>Log Conversation with {member.name || 'Team Member'}</span>
                    </Button>
                  </div>
                </div>

                <div className="md:w-3/5">
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#FB4694] mr-2"></span>
                      <span className="text-[#7D7B7B]">{member.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />

      {/* Conversation Log Modal */}
      {isConversationModalOpen && member && member.id && member.name && (
        <ConversationLogModal 
          onClose={handleCloseConversationModal} 
          onSuccess={handleConversationSuccess}
          teamMemberId={member.id}
          teamMemberName={member.name}
        />
      )}

      {/* Success Modal */}
      {isConversationSuccessModalOpen && (
        <SuccessModal onClose={handleCloseConversationSuccessModal} />
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
              {/* Empty header in skeleton to match actual layout */}

              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/5">
                  <Skeleton className="h-80 w-full rounded-xl aspect-[3/4]" />
                  <div className="mt-6">
                    <Skeleton className="h-10 w-48 mb-4" />
                    <div className="flex gap-3">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-10 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:w-3/5">
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <Skeleton className="h-6 w-32" />
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