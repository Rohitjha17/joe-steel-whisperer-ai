import React, { useEffect, useState } from "react";

interface JoeAvatarProps {
  isSpeaking?: boolean;
}

export function JoeAvatar({ isSpeaking = false }: JoeAvatarProps) {
  const [animationState, setAnimationState] = useState(0);

  // Subtle breathing animation (slight scale in/out)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 3);
    }, 2200);

    return () => clearInterval(intervalId);
  }, []);

  const getAnimationClass = () => {
    if (isSpeaking) {
      return "scale-100 animate-subtle-bounce";
    }
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
        padding: "0px",
      }}
    >
      {/* Landscape, massive avatar image */}
      <div className="relative w-full h-full flex items-start overflow-hidden"
        style={{
          height: "100%",
          minHeight: "230px",
          display: "flex",
          alignItems: "flex-start", // Align to top
        }}
      >
        <img
          src="/lovable-uploads/123.png"
          alt="Joe - Steel Industry Expert"
          className={`object-cover w-full h-full ${isSpeaking ? 'animate-subtle-pulse' : ''}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 0%", // Align to top
            transform: "scale(1.3)", // Increased scale more
            transformOrigin: "top center", // Scale from top
          }}
        />
        {/* Name overlay - positioned over the image */}
        <div className="absolute bottom-6 left-0 w-full flex justify-center z-20">
          <div className="text-white text-2xl font-extrabold drop-shadow-lg tracking-wide bg-black/60 px-8 py-3 rounded-full backdrop-blur-sm">
            Joe – Your Steel Industry Expert
          </div>
        </div>
      </div>
    </div>
  );
}

