
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// High-class, large Joe avatar with luxury ring, shadow, and your provided image
export function JoeAvatar() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-40 w-40 md:h-48 md:w-48 border-[8px] border-steel-200 shadow-2xl bg-gradient-to-tr from-steel-100 to-steel-50 ring-8 ring-steel-400/70 hover:scale-105 transition-transform duration-300">
          <AvatarImage
            src="/lovable-uploads/b211768e-5f5f-4d1f-a689-9503b674638a.png"
            alt="Joe - Legendary Steel Expert"
            className="aspect-square object-cover h-full w-full"
          />
          <AvatarFallback className="bg-steel-700 text-white text-6xl font-extrabold tracking-wide flex items-center justify-center">
            J
          </AvatarFallback>
        </Avatar>
        {/* Subtle status dot */}
        <div className="absolute bottom-4 right-4 h-7 w-7 rounded-full bg-green-500 border-4 border-white shadow-lg animate-pulse" />
      </div>
      <div className="mt-2 text-[1rem] md:text-lg text-steel-700 font-semibold tracking-wide drop-shadow-lg">
        Your AI Steel Consultant
      </div>
    </div>
  );
}

