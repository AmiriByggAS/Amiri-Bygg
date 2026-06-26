import React, { useState, useEffect } from "react";
import amiriDefaultLogo from "../assets/images/amiri_logo_1782472475944.jpg";

interface LogoProps {
  className?: string;
  showText?: boolean;
  lang?: "no" | "en";
  isDarkBg?: boolean;
  variant?: "full" | "icon";
}

export default function Logo({ 
  className = "w-10 h-10", 
  showText = true, 
  lang = "no", 
  isDarkBg = false,
  variant = "full" 
}: LogoProps) {
  // Check for custom logo in local storage
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem("amiri_custom_logo");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setCustomLogo(localStorage.getItem("amiri_custom_logo"));
      } catch (err) {
        console.error("Failed to read custom logo", err);
      }
    };

    window.addEventListener("amiri_logo_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("amiri_logo_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Brand Colors exactly from the logo image:
  // Deep Blue (Navy)
  const navyColor = "#0B2240";
  // Golden Yellow / Warm Orange
  const orangeColor = "#EE9D26";

  const cx = 100;
  const cy = 100;

  // Top text: "AMIRI BYGG AS" (13 characters)
  const topText = "AMIRI BYGG AS";
  const rTop = 71;
  const topSpan = 118; // degrees span
  const startTopAngle = -90 - topSpan / 2;
  const stepTopAngle = topSpan / (topText.length - 1);
  const topLetters = topText.split("").map((char, i) => {
    const angleDeg = startTopAngle + i * stepTopAngle;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = cx + rTop * Math.cos(angleRad);
    const y = cy + rTop * Math.sin(angleRad);
    const rotation = angleDeg + 90;
    return { char, x, y, rotation };
  });

  // Bottom text: "HUS OG HÅNDVERK" (15 characters)
  const bottomText = "HUS OG HÅNDVERK";
  const rBottom = 72;
  const bottomSpan = 116; // degrees span
  const startBottomAngle = 90 + bottomSpan / 2;
  const stepBottomAngle = bottomSpan / (bottomText.length - 1);
  const bottomLetters = bottomText.split("").map((char, i) => {
    const angleDeg = startBottomAngle - i * stepBottomAngle;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = cx + rBottom * Math.cos(angleRad);
    const y = cy + rBottom * Math.sin(angleRad);
    const rotation = angleDeg - 90;
    return { char, x, y, rotation };
  });

  // For 'full' logo, a solid white background circle makes it look EXACTLY like the image and ensures contrast on any BG!
  const hasBadgeBg = variant === "full";

  return (
    <div className="flex items-center gap-3 select-none">
      <img 
        src={customLogo || amiriDefaultLogo} 
        alt="Amiri Bygg Logo" 
        className={`${className} object-contain`}
        referrerPolicy="no-referrer"
      />

      {showText && (
        <div className="flex flex-col text-left">
          <span 
            className="text-xl font-bold tracking-tight uppercase leading-none" 
            style={{ color: isDarkBg ? "#FFFFFF" : navyColor }}
          >
            Amiri <span style={{ color: orangeColor }}>Bygg</span>
          </span>
          <span className="text-[8px] font-mono tracking-[0.25em] uppercase leading-none mt-1 text-stone-400">
            {lang === "no" ? "Totalentreprenør" : "Turnkey Contractor"}
          </span>
        </div>
      )}
    </div>
  );
}
