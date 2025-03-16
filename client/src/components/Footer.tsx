import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import React from "react";

export default function Footer() {
  // Memoize the current year to avoid unnecessary re-renders
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);
  
  return (
    <footer className="bg-[#292929] text-white py-8 md:py-12" role="contentinfo" aria-labelledby="footer-heading">
      <div className="container mx-auto px-4">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 className="font-poppins font-semibold text-lg md:text-xl mb-3 md:mb-4">Know Your Lemons</h3>
            <p className="text-gray-300 text-sm md:text-base mb-3 md:mb-4">Empowering women through breast health education in the Bahamas.</p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Follow us on Facebook" 
                className="text-white hover:text-[#FFFE77] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFFE77] focus:ring-offset-2 focus:ring-offset-[#292929] rounded"
              >
                <Facebook size={18} aria-hidden="true" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Follow us on Instagram" 
                className="text-white hover:text-[#FFFE77] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFFE77] focus:ring-offset-2 focus:ring-offset-[#292929] rounded"
              >
                <Instagram size={18} aria-hidden="true" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Follow us on Twitter" 
                className="text-white hover:text-[#FFFE77] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFFE77] focus:ring-offset-2 focus:ring-offset-[#292929] rounded"
              >
                <Twitter size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
          
          <nav aria-labelledby="footer-navigation">
            <h3 className="font-poppins font-semibold text-lg md:text-xl mb-3 md:mb-4" id="footer-navigation">Quick Links</h3>
            <ul className="space-y-2" role="list">
              <li><a href="/about" className="text-gray-300 text-sm md:text-base hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">About Us</a></li>
              <li><a href="/programs" className="text-gray-300 text-sm md:text-base hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">Our Programs</a></li>
              <li><a href="/resources" className="text-gray-300 text-sm md:text-base hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">Resources</a></li>
              <li><a href="/contact" className="text-gray-300 text-sm md:text-base hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">Contact</a></li>
            </ul>
          </nav>
          
          <div aria-labelledby="contact-heading">
            <h3 className="font-poppins font-semibold text-lg md:text-xl mb-3 md:mb-4" id="contact-heading">Contact Us</h3>
            <address className="not-italic">
              <ul className="space-y-2" role="list">
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 mt-1 mr-2 md:mr-3 text-[#FB4694] flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-300 text-sm md:text-base">Nassau, Bahamas</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 mt-1 mr-2 md:mr-3 text-[#FB4694] flex-shrink-0" aria-hidden="true" />
                  <a href="mailto:info@knowyourlemons.bs" className="text-gray-300 text-sm md:text-base break-words hover:text-white transition-colors duration-200">
                    info@knowyourlemons.bs
                  </a>
                </li>
                <li className="flex items-start">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 mt-1 mr-2 md:mr-3 text-[#FB4694] flex-shrink-0" aria-hidden="true" />
                  <a href="tel:+12425551234" className="text-gray-300 text-sm md:text-base hover:text-white transition-colors duration-200">
                    +1 (242) 555-1234
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400">
          <p className="mb-1 md:mb-2 text-xs md:text-sm">&copy; {currentYear} Know Your Lemons Bahamas. All rights reserved.</p>
          <p className="text-xs md:text-sm">
            Developed by: 
            <a 
              href="https://kemisdigital.com" 
              className="ml-1 text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              KemisDigital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
