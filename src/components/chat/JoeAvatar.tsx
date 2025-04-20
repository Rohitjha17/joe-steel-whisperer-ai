
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Avatar uses the user's provided image and is visually prominent.
export function JoeAvatar() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-28 w-28 md:h-36 md:w-36 lg:h-40 lg:w-40 border-4 border-steel-300 shadow-xl bg-white animate-fade-in">
          <AvatarImage
            src="/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png"
            alt="Joe - Legendary Steel Expert"
            className="aspect-square object-cover h-full w-full"
          />
          <AvatarFallback className="bg-steel-700 text-white text-6xl font-extrabold flex items-center justify-center">
            J
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-3 text-lg text-steel-700 font-semibold tracking-wide text-center drop-shadow-sm">
        Joe – Your Steel Industry Expert
      </div>
    </div>
  );
}
