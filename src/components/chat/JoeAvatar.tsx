
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function JoeAvatar() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-32 w-32 md:h-40 md:w-40 animate-pulse">
          <AvatarImage
            src="/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png"
            alt="Joe - Steel Industry Expert"
            className="aspect-square object-cover h-full w-full"
          />
          <AvatarFallback className="bg-steel-700 text-white text-6xl font-extrabold flex items-center justify-center">
            J
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-3 text-lg font-semibold tracking-wide text-center">
        Joe – Your Steel Industry Expert
      </div>
    </div>
  );
}
