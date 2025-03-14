import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import TeamGrid from "@/components/TeamGrid";
import Footer from "@/components/Footer";
import JoinFormModal from "@/components/JoinFormModal";
import SuccessModal from "@/components/SuccessModal";
import { TeamMember } from "@/lib/teamMembers";
import { LockKeyhole } from "lucide-react";

export default function Home() {
  const [isJoinFormOpen, setIsJoinFormOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const teamSectionRef = useRef<HTMLDivElement>(null);

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
  
  // Scroll to team section
  const scrollToTeamSection = () => {
    teamSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F8F6F4] font-montserrat text-[#292929] min-h-screen">
      <Hero onJoinClick={scrollToTeamSection} />
      
      {/* Mission section */}
      <section className="py-16 px-4 bg-white relative">
        {/* MAP Bahamas Image as Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
          <img
            src="https://map-bahamas.com/wp-content/uploads/2024/11/03.png"
            alt="MAP Bahamas Watermark"
            className="w-full"
          />
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl font-poppins font-bold mb-8">Our Global Impact</h2>
          
          <p className="text-lg leading-relaxed mb-6">
            The Lemonistas are part of a powerful global movement—1,106 educators across 71 countries, 
            reaching communities in 40 languages. Through the Know Your Lemons Foundation's partnership 
            with the Mammogram Access Program (MAP), they are bringing this life-saving breast health 
            education to The Bahamas.
          </p>
          <p className="text-lg leading-relaxed">
            By teaching the 12 signs of breast cancer and promoting early detection, they empower women 
            to take charge of their health and increase survival rates.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-[#F8F6F4] p-6 rounded-xl shadow-sm">
              <h3 className="text-4xl font-bold text-[#FB4694] mb-2">1,106</h3>
              <p className="text-gray-700">Educators Worldwide</p>
            </div>
            <div className="bg-[#F8F6F4] p-6 rounded-xl shadow-sm">
              <h3 className="text-4xl font-bold text-[#FB4694] mb-2">71</h3>
              <p className="text-gray-700">Countries</p>
            </div>
            <div className="bg-[#F8F6F4] p-6 rounded-xl shadow-sm">
              <h3 className="text-4xl font-bold text-[#FB4694] mb-2">40</h3>
              <p className="text-gray-700">Languages</p>
            </div>
          </div>
        </div>
      </section>

      <div ref={teamSectionRef}>
        <TeamGrid 
          teamMembers={teamMembers || []} 
          isLoading={isLoading} 
          onJoinClick={handleOpenJoinForm}
        />
      </div>
      {/* Admin link (this would typically be secured in a real application) */}
      <div className="container mx-auto px-4 py-8 text-right">
        <Link href="/admin">
          <Button variant="outline" className="bg-white text-gray-600 hover:bg-gray-100">
            <LockKeyhole className="h-4 w-4 mr-2" />
            Admin Dashboard
          </Button>
        </Link>
      </div>

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