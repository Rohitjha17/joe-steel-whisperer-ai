
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Larger, elegant avatar with ring and shadow for prestige look
export function JoeAvatar() {
  return (
    <div className="relative flex justify-center items-center">
      <Avatar className="h-32 w-32 border-[6px] border-steel-300 shadow-xl bg-gradient-to-tr from-steel-200 to-steel-50 ring-4 ring-steel-400 hover:scale-105 transition-transform duration-300">
        <AvatarImage
          src="/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png"
          alt="Joe - Steel Industry Expert"
          className="object-cover h-full w-full"
        />
        <AvatarFallback className="bg-steel-700 text-white text-4xl font-bold">
          JOE
        </AvatarFallback>
      </Avatar>
      <div className="absolute bottom-3 right-3 h-5 w-5 rounded-full bg-green-500 border-2 border-white shadow-md" />
    </div>
  );
}
