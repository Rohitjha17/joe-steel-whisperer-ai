
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function JoeAvatar() {
  return (
    <div className="relative flex justify-center items-center">
      <Avatar className="h-24 w-24 border-4 border-steel-300 shadow-lg bg-gradient-to-tr from-steel-200 to-steel-50">
        <AvatarImage
          src="/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png"
          alt="Joe - Steel Industry Expert"
          className="object-cover h-full w-full"
        />
        <AvatarFallback className="bg-steel-700 text-white text-3xl font-bold">
          JOE
        </AvatarFallback>
      </Avatar>
      <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
    </div>
  );
}
