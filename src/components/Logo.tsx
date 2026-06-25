import React, { useState, useEffect } from "react";

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
      {customLogo ? (
        // Render exact custom image uploaded by the user!
        <img 
          src={customLogo} 
          alt="Amiri Bygg Logo" 
          className={`${className} object-contain`}
          referrerPolicy="no-referrer"
        />
      ) : (
        /* Crisp Symmetrical SVG Logo of Amiri Bygg */
        <svg 
          className={`${className} flex-shrink-0`} 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          id="amiri-bygg-logo-svg"
        >
          {/* Solid white circular background inside the outer border to make the badge pop, just like physical stickers */}
          {hasBadgeBg && (
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              fill="#FFFFFF" 
            />
          )}

          {/* Outer Circular Border - Thick elegant navy ring */}
          {variant === "full" && (
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              stroke={navyColor} 
              strokeWidth="6" 
              fill="none"
            />
          )}

          {/* Top Text: "AMIRI BYGG AS" in bold warm orange (Rotated text nodes for 100% browser compatibility) */}
          {variant === "full" && (
            <g className="font-sans font-black select-none text-[17px]" fill={orangeColor}>
              {topLetters.map((item, idx) => (
                <text
                  key={`top-${idx}`}
                  x="0"
                  y="0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation})`}
                >
                  {item.char}
                </text>
              ))}
            </g>
          )}

          {/* Bottom Text: "HUS OG HÅNDVERK" in bold deep navy (Rotated text nodes for 100% browser compatibility) */}
          {variant === "full" && (
            <g className="font-sans font-black select-none text-[13px]" fill={navyColor}>
              {bottomLetters.map((item, idx) => (
                <text
                  key={`bottom-${idx}`}
                  x="0"
                  y="0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation})`}
                >
                  {item.char}
                </text>
              ))}
            </g>
          )}

          {/* --- Central Illustration: Symmetrical Roofs & House --- */}
          {/* Outer navy roof with vertical legs */}
          <path 
            d="M 100,68 L 155,115 L 155,122 L 141,122 L 141,115 L 100,80 L 59,115 L 59,122 L 45,122 L 45,115 Z" 
            fill={isDarkBg && variant === "icon" ? "#FFFFFF" : navyColor} 
          />
          
          {/* Inner navy roof with vertical legs */}
          <path 
            d="M 100,83 L 138,115 L 138,122 L 125,122 L 125,115 L 100,95 L 75,115 L 75,122 L 62,122 L 62,115 Z" 
            fill={isDarkBg && variant === "icon" ? "#FFFFFF" : navyColor} 
          />

          {/* Horizontal base line beneath the house structure */}
          <rect 
            x="41" 
            y="123" 
            width="118" 
            height="5" 
            fill={isDarkBg && variant === "icon" ? "#FFFFFF" : navyColor} 
          />

          {/* Symmetrical Orange/Yellow House Body */}
          <rect 
            x="86" 
            y="104" 
            width="28" 
            height="19" 
            fill={orangeColor} 
          />
          {/* Triangle roof for the small inner house */}
          <polygon 
            points="76,104 100,82 124,104" 
            fill={orangeColor} 
          />

          {/* Four Window Panes inside the orange house */}
          {(() => {
            const windowFill = variant === "full" 
              ? "#FFFFFF" 
              : (isDarkBg ? "#111827" : "#FFFFFF");
            return (
              <>
                <rect x="93" y="100" width="6" height="6" fill={windowFill} />
                <rect x="101" y="100" width="6" height="6" fill={windowFill} />
                <rect x="93" y="108" width="6" height="6" fill={windowFill} />
                <rect x="101" y="108" width="6" height="6" fill={windowFill} />
              </>
            );
          })()}

          {/* Four-Point Golden Star (Sparkle) at the top peak of the roof */}
          <path 
            d="M 100,36 Q 100,48 112,48 Q 100,48 100,60 Q 100,48 88,48 Q 100,48 100,36 Z" 
            fill={orangeColor} 
          />
        </svg>
      )}

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
