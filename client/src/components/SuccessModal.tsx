import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import confetti from "canvas-confetti";

interface SuccessModalProps {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true
      });
      
      // Fire confetti
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FB4694', '#7D7B7B', '#FFFE77', '#4F2C4C']
      });
      
      // Fire again with a slight delay
      setTimeout(() => {
        myConfetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FB4694', '#7D7B7B', '#FFFE77', '#4F2C4C']
        });
      }, 250);
      
      setTimeout(() => {
        myConfetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FB4694', '#7D7B7B', '#FFFE77', '#4F2C4C']
        });
      }, 400);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-[#292929] bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md text-center p-8 relative">
        <canvas ref={confettiCanvasRef} className="absolute inset-0 pointer-events-none"></canvas>
        
        <div className="mb-6 relative z-10">
          <div className="w-20 h-20 rounded-full bg-[#FB4694] bg-opacity-20 flex items-center justify-center mx-auto mb-4">
            <Check className="h-10 w-10 text-[#FB4694]" />
          </div>
          <h2 className="text-2xl font-poppins font-bold mb-2">Conversation Logged!</h2>
          <p className="text-[#7D7B7B]">
            Thank you for recording this important interaction. Your contribution helps track our team's impact!
          </p>
        </div>
        
        <Button 
          onClick={onClose}
          className="bg-[#FB4694] text-white font-poppins font-medium px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
