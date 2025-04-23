
import React, { useEffect, useState } from "react";

export function JoeAvatar() {
  const [animationState, setAnimationState] = useState(0);

  // Subtle breathing animation (slight scale in/out)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 3);
    }, 2000);

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
      }}
    >
      {/* Large rectangular avatar image, landscape, B&W */}
      <div className="relative w-full flex-1 flex items-center rounded-[1.8rem] overflow-hidden">
        <img
          src="/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png"
          alt="Joe - Steel Industry Expert"
          className="object-cover w-full h-full grayscale"
          style={{
            minHeight: 0,
            minWidth: 0,
            aspectRatio: "370/600",
            // aspect ratio is overridden by phone container, just auto-fit
          }}
        />
        {/* Optional: overlay bottom gradient for foregrounding name */}
        <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 pointer-events-none" />
        {/* Name overlay */}
        <div className="absolute bottom-3 left-0 w-full flex justify-center z-20">
          <div className="text-white text-2xl font-extrabold drop-shadow-md tracking-wide bg-black/50 px-6 py-1 rounded-full backdrop-blur-xs">
            Joe – Your Steel Industry Expert
          </div>
        </div>
      </div>
    </div>
  );
}
