
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function JoeAvatar() {
  const [animationState, setAnimationState] = useState(0);

  // Create subtle "breathing" animation effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  // For simple animation transitions
  const getAnimationClass = () => {
    switch (animationState) {
      case 0:
        return "scale-100 transition-transform duration-2000";
      case 1:
        return "scale-[1.03] transition-transform duration-2000";
      case 2:
        return "scale-100 transition-transform duration-2000";
      default:
        return "scale-100";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="relative flex items-center justify-center">
        <div
          className={`overflow-hidden rounded-3xl border-2 border-black bg-white shadow-lg mx-auto ${getAnimationClass()}`}
          style={{
            width: "720px", // landscape width
            height: "320px", // landscape height (about 16:7 ratio)
            maxWidth: "90vw",
            maxHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar className="w-full h-full rounded-3xl">
            <AvatarImage
              src="/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png"
              alt="Joe - Steel Industry Expert"
              className="object-cover w-full h-full"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <AvatarFallback className="bg-black text-white text-7xl font-extrabold flex items-center justify-center rounded-3xl">
              J
            </AvatarFallback>
          </Avatar>
        </div>
        {/* Optional: subtle shadow, floating or spark effect can be added here */}
      </div>
      <div className="mt-8 text-4xl font-extrabold tracking-wide text-center text-black">
        Joe – Your Steel Industry Expert
      </div>
    </div>
  );
}
