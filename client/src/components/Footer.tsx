import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#292929] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-4">Know Your Lemons</h3>
            <p className="text-gray-300 mb-4">Empowering women through breast health education in the Bahamas.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#FFFE77] transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#FFFE77] transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-[#FFFE77] transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Our Programs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Resources</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-[#FB4694]" />
                <span className="text-gray-300">Nassau, Bahamas</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-1 mr-3 text-[#FB4694]" />
                <span className="text-gray-300">info@knowyourlemons.bs</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mt-1 mr-3 text-[#FB4694]" />
                <span className="text-gray-300">+1 (242) 555-1234</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p className="mb-2">&copy; {new Date().getFullYear()} Know Your Lemons Bahamas. All rights reserved.</p>
          <p className="text-sm">Developed by: KemisDigital</p>
        </div>
      </div>
    </footer>
  );
}
