import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#292929] text-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 className="font-poppins font-semibold text-lg md:text-xl mb-3 md:mb-4">Know Your Lemons</h3>
            <p className="text-gray-300 text-sm md:text-base mb-3 md:mb-4">Empowering women through breast health education in the Bahamas.</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-white hover:text-[#FFFE77] transition">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="text-white hover:text-[#FFFE77] transition">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="text-white hover:text-[#FFFE77] transition">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold text-lg md:text-xl mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 text-sm md:text-base hover:text-white transition">About Us</a></li>
              <li><a href="#" className="text-gray-300 text-sm md:text-base hover:text-white transition">Our Programs</a></li>
              <li><a href="#" className="text-gray-300 text-sm md:text-base hover:text-white transition">Resources</a></li>
              <li><a href="#" className="text-gray-300 text-sm md:text-base hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold text-lg md:text-xl mb-3 md:mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mt-1 mr-2 md:mr-3 text-[#FB4694]" />
                <span className="text-gray-300 text-sm md:text-base">Nassau, Bahamas</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-4 w-4 md:h-5 md:w-5 mt-1 mr-2 md:mr-3 text-[#FB4694]" />
                <span className="text-gray-300 text-sm md:text-base break-words">info@knowyourlemons.bs</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 md:h-5 md:w-5 mt-1 mr-2 md:mr-3 text-[#FB4694]" />
                <span className="text-gray-300 text-sm md:text-base">+1 (242) 555-1234</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400">
          <p className="mb-1 md:mb-2 text-xs md:text-sm">&copy; {new Date().getFullYear()} Know Your Lemons Bahamas. All rights reserved.</p>
          <p className="text-xs md:text-sm">Developed by: KemisDigital</p>
        </div>
      </div>
    </footer>
  );
}
