
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function JoeAvatar() {
  const [animationState, setAnimationState] = useState(0);
  
  // Create breathing animation effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 3);
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Different animation classes based on state
  const getAnimationClass = () => {
    switch(animationState) {
      case 0: return "scale-100 transition-transform duration-2000";
      case 1: return "scale-105 transition-transform duration-2000";
      case 2: return "scale-100 transition-transform duration-2000";
      default: return "scale-100";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="relative">
        <Avatar className={`h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 ${getAnimationClass()}`}>
          <AvatarImage
            src="/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png"
            alt="Joe - Steel Industry Expert"
            className="aspect-square object-cover h-full w-full"
          />
          <AvatarFallback className="bg-steel-700 text-white text-6xl font-extrabold flex items-center justify-center">
            J
          </AvatarFallback>
        </Avatar>
        
        {/* Subtle floating effect for the avatar */}
        <div className="absolute inset-0 animate-[bounce_6s_ease-in-out_infinite] opacity-0 pointer-events-none">
          {/* This div just adds the floating animation */}
        </div>
      </div>
      <div className="mt-6 text-3xl font-semibold tracking-wide text-center text-steel-800">
        Joe – Your Steel Industry Expert
      </div>
    </div>
  );
}
