import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import TeamGrid from "@/components/TeamGrid";
import Footer from "@/components/Footer";
import JoinFormModal from "@/components/JoinFormModal";
import SuccessModal from "@/components/SuccessModal";
import SelfieUploadModal from "@/components/SelfieUploadModal";
import { TeamMember } from "@/lib/teamMembers";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export default function Home() {
  const [isJoinFormOpen, setIsJoinFormOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  const handleOpenJoinForm = () => {
    setIsJoinFormOpen(true);
  };

  const handleCloseJoinForm = () => {
    setIsJoinFormOpen(false);
  };

  const handleFormSuccess = () => {
    setIsJoinFormOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="bg-[#F8F6F4] font-montserrat text-[#292929] min-h-screen">
      <Hero onJoinClick={handleOpenJoinForm} />
      <TeamGrid 
        teamMembers={teamMembers || []} 
        isLoading={isLoading} 
        onJoinClick={handleOpenJoinForm}
      />
      <Footer />
      
      {isJoinFormOpen && (
        <JoinFormModal 
          onClose={handleCloseJoinForm} 
          onSuccess={handleFormSuccess}
        />
      )}
      
      {isSuccessModalOpen && (
        <SuccessModal onClose={handleCloseSuccessModal} />
      )}
    </div>
  );
}
