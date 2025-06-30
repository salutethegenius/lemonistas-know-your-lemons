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

  // Optimized query with caching and error handling
  const { data: teamMembers, isLoading, error } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
    staleTime: 10 * 60 * 1000, // 10 minutes cache before refetching
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection time
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load team members</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F6F4] font-montserrat text-[#292929] min-h-screen">
      <Hero onJoinClick={scrollToTeamSection} />
      
      {/* Mission section */}
      <section className="py-12 md:py-16 px-4 bg-white relative">
        {/* MAP Bahamas Image as Watermark - Using local asset instead of external URL for better performance */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
          <img
            src="/attached_assets/Copy of Copy of Website Mock - MAP BAHAMAS.png"
            alt="MAP Bahamas Watermark"
            className="w-full object-cover"
            width="1200"
            height="800"
            loading="lazy"
          />
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-poppins font-bold mb-6 md:mb-8">Our Global Impact</h2>
          
          <p className="text-base md:text-lg leading-relaxed mb-4 md:mb-6">
            The Lemonistas are part of a powerful global movement—1,106 educators across 71 countries, 
            reaching communities in 40 languages. Through the Know Your Lemons Foundation's partnership 
            with the Mammogram Access Program (MAP), they are bringing this life-saving breast health 
            education to The Bahamas.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            By teaching the 12 signs of breast cancer and promoting early detection, they empower women 
            to take charge of their health and increase survival rates.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
            <div className="bg-[#F8F6F4] p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-3xl md:text-4xl font-bold text-[#FB4694] mb-2">1,106</h3>
              <p className="text-gray-700">Educators Worldwide</p>
            </div>
            <div className="bg-[#F8F6F4] p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-3xl md:text-4xl font-bold text-[#FB4694] mb-2">71</h3>
              <p className="text-gray-700">Countries</p>
            </div>
            <div className="bg-[#F8F6F4] p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-3xl md:text-4xl font-bold text-[#FB4694] mb-2">40</h3>
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