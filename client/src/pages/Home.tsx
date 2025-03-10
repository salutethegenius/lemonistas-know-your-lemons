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
  const [isSelfieModalOpen, setIsSelfieModalOpen] = useState(false);
  const [isSelfieSuccessModalOpen, setIsSelfieSuccessModalOpen] = useState(false);

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

  return (
    <div className="bg-[#F8F6F4] font-montserrat text-[#292929] min-h-screen">
      <Hero onJoinClick={handleOpenJoinForm} />
      
      {/* Upload Selfie Button */}
      <div className="container mx-auto px-4 py-6 flex justify-center">
        <Button 
          onClick={handleOpenSelfieModal} 
          className="group relative overflow-hidden bg-[#FB4694] hover:bg-[#FB4694]/90 text-white px-8 py-6 rounded-xl shadow-lg transform transition-all hover:scale-105"
        >
          <span className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            <span className="text-lg font-semibold">Upload Selfie!</span>
          </span>
          <span className="absolute bottom-0 left-0 h-1 w-full bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </Button>
      </div>
      
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
      
      {isSelfieModalOpen && (
        <SelfieUploadModal 
          onClose={handleCloseSelfieModal} 
          onSuccess={handleSelfieSuccess}
        />
      )}
      
      {isSelfieSuccessModalOpen && (
        <SuccessModal onClose={handleCloseSelfieSuccessModal} />
      )}
    </div>
  );
}
