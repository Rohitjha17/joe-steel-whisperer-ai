
import React, { useEffect, useState } from "react";

export function JoeAvatar() {
  const [animationState, setAnimationState] = useState(0);

  // Subtle breathing animation (slight scale in/out)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 3);
    }, 2200);

    return () => clearInterval(intervalId);
  }, []);

  const getAnimationClass = () => {
    switch (animationState) {
      case 0:
        return "scale-100 transition-transform duration-2000";
      case 1:
        return "scale-[1.025] transition-transform duration-2000";
      case 2:
        return "scale-100 transition-transform duration-2000";
      default:
        return "scale-100";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-start w-full ${getAnimationClass()}`}
      style={{
        flex: "1 1 0%",
        height: "100%",
        maxHeight: "100%",
      }}
    >
      {/* Landscape, massive avatar image */}
      <div className="relative w-full flex items-end rounded-[2.3rem] overflow-hidden bg-[#222]"
        style={{
          // Large, landscape rectangle (phone inside phone)
          aspectRatio: "16/9",
          height: "calc(100vh * 0.64)",
          maxHeight: "550px",
          boxShadow: "0 8px 32px 6px rgba(0,0,0,0.45)",
          minHeight: "230px",
        }}
      >
        <img
          src="/lovable-uploads/c354a583-7f30-4038-85c5-7413ddb2217c.png"
          alt="Joe - Steel Industry Expert"
          className="object-cover w-full h-full grayscale"
          style={{
            minHeight: "100%",
            minWidth: "100%",
            objectFit: "cover",
            filter: "grayscale(1)",
            aspectRatio: "16/9",
          }}
        />
        {/* Optional: overlay bottom gradient for foregrounding name */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 pointer-events-none" />
        {/* Name overlay */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center z-20">
          <div className="text-white text-2xl font-extrabold drop-shadow-md tracking-wide bg-black/50 px-8 py-2 rounded-full backdrop-blur-xs">
            Joe – Your Steel Industry Expert
          </div>
        </div>
      </div>
    </div>
  );
}

