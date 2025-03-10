interface HeroProps {
  onJoinClick: () => void;
}

export default function Hero({ onJoinClick }: HeroProps) {
  return (
    <header className="relative bg-[#4F2C4C]">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins text-white mb-4">
              Meet Our Lemonistas
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Our passionate team of educators spreading breast health awareness through the "Know Your Lemons" initiative in the Bahamas.
            </p>
          </div>
          <div className="w-24 h-1 bg-[#FFFE77] mb-8"></div>
          <button 
            onClick={onJoinClick}
            className="bg-[#FFFE77] text-[#292929] font-poppins font-semibold px-8 py-3 rounded-xl hover:bg-yellow-300 transition duration-300"
          >
            Join Our Team
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-[#FFFE77] opacity-20"></div>
    </header>
  );
}
