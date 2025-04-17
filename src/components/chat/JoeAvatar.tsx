
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function JoeAvatar() {
  return (
    <div className="relative">
      <Avatar className="h-24 w-24 border-4 border-white shadow-md">
        {/* In a real application, we would use an actual image of Joe */}
        <AvatarFallback className="bg-steel-700 text-white text-3xl font-bold">
          JOE
        </AvatarFallback>
      </Avatar>
      <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
    </div>
  );
}
