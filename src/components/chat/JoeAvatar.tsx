
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function JoeAvatar() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-56 w-56 border-4 border-steel-300 shadow-xl bg-white">
          <AvatarImage
            src="/lovable-uploads/782b9ab1-c9c7-4b24-8b4a-afca4b92620b.png"
            alt="Joe - Legendary Steel Expert"
            className="aspect-square object-cover h-full w-full"
          />
          <AvatarFallback className="bg-steel-700 text-white text-6xl font-extrabold flex items-center justify-center">
            J
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-3 text-lg text-steel-700 font-semibold tracking-wide text-center">
        Joe – Your Steel Industry Expert
      </div>
    </div>
  );
}
