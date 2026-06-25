import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, MoveHorizontal, Calendar, Home, CheckCircle2, Facebook, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationSchema } from "../translations";

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.5-.77-.57-1.39-1.33-1.81-2.2v9.33c0 1.95-.51 3.91-1.66 5.5-1.42 1.95-3.83 3.03-6.23 2.82-2.58-.23-4.99-1.89-6.07-4.24-1.21-2.6-1.02-5.88.66-8.25 1.43-2.02 3.92-3.14 6.38-2.92.01 1.41-.01 2.82 0 4.22-1.38-.11-2.88.38-3.69 1.55-.83 1.22-.84 2.94-.01 4.15.82 1.19 2.37 1.72 3.73 1.39 1.17-.29 2.05-1.33 2.16-2.54.02-2.31.01-4.63.01-6.94V0h4.09c-.01.01-.01.01-.02.02z"/>
  </svg>
);

interface PortfolioProps {
  t: TranslationSchema;
}

interface Project {
  id: number;
  title: string;
  category: "renovation" | "kitchen-bath" | "exterior";
  location: string;
  size: string;
  duration: string;
  image: string;
  completionYear: string;
}

export default function Portfolio({ t }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "renovation" | "kitchen-bath" | "exterior">("all");
  const [sliderPosition, setSliderPosition] = useState(50);
  const beforeAfterContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const [beforeImage, setBeforeImage] = useState<string>(() => {
    try {
      return localStorage.getItem("amiri_custom_before") || "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1600&q=90";
    } catch {
      return "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1600&q=90";
    }
  });

  const [afterImage, setAfterImage] = useState<string>(() => {
    try {
      return localStorage.getItem("amiri_custom_after") || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90";
    } catch {
      return "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90";
    }
  });

  const [customProjectImages, setCustomProjectImages] = useState<Record<number, string>>(() => {
    const records: Record<number, string> = {};
    for (let i = 1; i <= 6; i++) {
      try {
        const custom = localStorage.getItem(`amiri_custom_project_${i}`);
        if (custom) records[i] = custom;
      } catch {}
    }
    return records;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setBeforeImage(localStorage.getItem("amiri_custom_before") || "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1600&q=90");
        setAfterImage(localStorage.getItem("amiri_custom_after") || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90");
        
        const records: Record<number, string> = {};
        for (let i = 1; i <= 6; i++) {
          const custom = localStorage.getItem(`amiri_custom_project_${i}`);
          if (custom) records[i] = custom;
        }
        setCustomProjectImages(records);
      } catch (err) {
        console.error("Failed to load portfolio imagery custom overrides", err);
      }
    };
    window.addEventListener("amiri_images_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("amiri_images_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const projects: Project[] = [
    {
      id: 1,
      title: t.nav.about === "Om oss" ? "Villa Holmenkollen" : "Villa Holmenkollen",
      category: "renovation",
      location: "Oslo",
      size: "240 m²",
      duration: t.nav.about === "Om oss" ? "5 måneder" : "5 months",
      image: customProjectImages[1] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      completionYear: "2025",
    },
    {
      id: 2,
      title: t.nav.about === "Om oss" ? "Kjøkkenoppgradering Nordstrand" : "Modern Kitchen Nordstrand",
      category: "kitchen-bath",
      location: "Nordstrand, Oslo",
      size: "28 m²",
      duration: t.nav.about === "Om oss" ? "4 uker" : "4 weeks",
      image: customProjectImages[2] || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
      completionYear: "2026",
    },
    {
      id: 3,
      title: t.nav.about === "Om oss" ? "Eksklusivt bad Frogner" : "Luxury Bathroom Frogner",
      category: "kitchen-bath",
      location: "Frogner, Oslo",
      size: "16 m²",
      duration: t.nav.about === "Om oss" ? "3 uker" : "3 weeks",
      image: customProjectImages[3] || "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
      completionYear: "2025",
    },
    {
      id: 4,
      title: t.nav.about === "Om oss" ? "Funkis tilbygg & terrasse" : "Modern Extension & Deck",
      category: "exterior",
      location: "Asker",
      size: "45 m²",
      duration: t.nav.about === "Om oss" ? "8 uker" : "8 weeks",
      image: customProjectImages[4] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      completionYear: "2025",
    },
    {
      id: 5,
      title: t.nav.about === "Om oss" ? "Fasade & etterisolering" : "Facade & Retro-Insulation",
      category: "exterior",
      location: "Bærum",
      size: "185 m²",
      duration: t.nav.about === "Om oss" ? "6 uker" : "6 weeks",
      image: customProjectImages[5] || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      completionYear: "2026",
    },
    {
      id: 6,
      title: t.nav.about === "Om oss" ? "Klassisk totalrenovering bygård" : "Heritage Apartment Renovation",
      category: "renovation",
      location: "Majorstuen, Oslo",
      size: "115 m²",
      duration: t.nav.about === "Om oss" ? "12 uker" : "12 weeks",
      image: customProjectImages[6] || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
      completionYear: "2025",
    },
  ];

  const filteredProjects = projects.filter(
    (proj) => activeFilter === "all" || proj.category === activeFilter
  );

  const handleMove = (clientX: number) => {
    if (!beforeAfterContainerRef.current) return;
    const rect = beforeAfterContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingRef.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleMove(e.clientX);
      }
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("touchmove", handleWindowTouchMove, { passive: true });
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("touchmove", handleWindowTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  const startDragging = () => {
    isDraggingRef.current = true;
  };

  return (
    <section id="portfolio" className="py-24 bg-stone-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-3">
            {t.nav.portfolio}
          </p>
          <h2 className="text-3xl sm:text-4xl font-sans font-semibold tracking-tight text-stone-900 mb-4">
            {t.portfolio.title}
          </h2>
          <div className="w-16 h-1 bg-brand-taupe mx-auto mb-6" />
          <p className="text-stone-600 font-light leading-relaxed">
            {t.portfolio.subtitle}
          </p>
        </div>

        {/* Before / After Slider Widget */}
        <div className="mb-24">
          <h3 className="text-center text-base font-bold uppercase tracking-widest text-brand-charcoal mb-2 font-sans">
            {t.portfolio.beforeAfterTitle}
          </h3>
          <p className="text-center text-stone-400 text-[10px] font-mono mb-8 uppercase tracking-widest">
            {t.portfolio.dragSliderHint}
          </p>

          <div
            id="before-after-slider-container"
            ref={beforeAfterContainerRef}
            onMouseDown={(e) => {
              e.preventDefault();
              startDragging();
              handleMove(e.clientX);
            }}
            onTouchStart={() => {
              startDragging();
            }}
            className="relative w-full max-w-5xl h-[400px] md:h-[550px] mx-auto overflow-hidden cursor-ew-resize border border-stone-200 shadow-xs select-none rounded-none"
          >
            {/* After Image Layer (Fully visible) */}
            <div className="absolute inset-0 bg-stone-100">
              <img
                src={afterImage}
                alt="After premium renovation by Amiri Bygg"
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 right-6 bg-brand-charcoal text-white text-[10px] font-mono font-medium py-1.5 px-3 uppercase tracking-wider rounded-none">
                {t.portfolio.afterLabel}
              </div>
            </div>

            {/* Before Image Layer (Clipped cleanly by CSS clipPath to prevent squishing) */}
            <div
              className="absolute inset-0 bg-stone-100"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={beforeImage}
                alt="Before renovation"
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 bg-brand-taupe text-brand-charcoal text-[10px] font-mono font-bold py-1.5 px-3 uppercase tracking-wider z-20 rounded-none">
                {t.portfolio.beforeLabel}
              </div>
            </div>

            {/* Slider Bar & Handle - Square Luxury Architectural style */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-brand-taupe z-30 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-brand-charcoal text-white rounded-none flex items-center justify-center shadow-md pointer-events-auto cursor-ew-resize hover:bg-brand-taupe transition-colors border border-white/10">
                <MoveHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Project Gallery Category Filter */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          <button
            id="filter-all"
            onClick={() => setActiveFilter("all")}
            className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-none ${
              activeFilter === "all"
                ? "bg-brand-charcoal text-white shadow-xs"
                : "bg-white hover:bg-brand-sand text-stone-600 border border-stone-200"
            }`}
          >
            {t.portfolio.filterAll}
          </button>
          <button
            id="filter-renovation"
            onClick={() => setActiveFilter("renovation")}
            className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-none ${
              activeFilter === "renovation"
                ? "bg-brand-charcoal text-white shadow-xs"
                : "bg-white hover:bg-brand-sand text-stone-600 border border-stone-200"
            }`}
          >
            {t.portfolio.filterRenovation}
          </button>
          <button
            id="filter-kitchen-bath"
            onClick={() => setActiveFilter("kitchen-bath")}
            className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-none ${
              activeFilter === "kitchen-bath"
                ? "bg-brand-charcoal text-white shadow-xs"
                : "bg-white hover:bg-brand-sand text-stone-600 border border-stone-200"
            }`}
          >
            {t.portfolio.filterKitchenBath}
          </button>
          <button
            id="filter-exterior"
            onClick={() => setActiveFilter("exterior")}
            className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-none ${
              activeFilter === "exterior"
                ? "bg-brand-charcoal text-white shadow-xs"
                : "bg-white hover:bg-brand-sand text-stone-600 border border-stone-200"
            }`}
          >
            {t.portfolio.filterExterior}
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj.id}
                id={`project-card-${proj.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-stone-200 overflow-hidden group hover:border-stone-400 transition-all duration-300 flex flex-col h-full"
              >
                {/* Project Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/0 transition-colors duration-300" />
                  
                  {/* Location Tag */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-stone-900 text-[10px] font-mono tracking-widest uppercase py-1 px-2.5 font-medium border border-stone-200">
                    {proj.location}
                  </div>
                </div>

                {/* Project Meta / Copy */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                        {proj.category === "renovation"
                          ? t.portfolio.filterRenovation
                          : proj.category === "kitchen-bath"
                          ? t.portfolio.filterKitchenBath
                          : t.portfolio.filterExterior}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {proj.completionYear}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold tracking-tight text-stone-900 font-sans mb-4 group-hover:text-stone-950 transition-colors">
                      {proj.title}
                    </h4>
                  </div>

                  {/* Built metrics list */}
                  <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider leading-none mb-1">
                        {t.portfolio.size}
                      </p>
                      <p className="text-sm font-semibold text-stone-700 leading-none">
                        {proj.size}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider leading-none mb-1">
                        {t.portfolio.duration}
                      </p>
                      <p className="text-sm font-semibold text-stone-700 leading-none">
                        {proj.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Beautiful, High-End Social Media CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-brand-charcoal text-white p-8 md:p-12 border border-white/10 border-l-4 border-l-brand-taupe relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 rounded-none shadow-lg"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-taupe/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl relative z-10 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-brand-taupe/10 border border-brand-taupe/20 px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-taupe animate-pulse" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand-taupe">
                {t.nav.about === "Om oss" ? "Løpende Oppdateringer" : "Real-time Updates"}
              </span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-white leading-tight">
              {t.nav.about === "Om oss" 
                ? "Vil du se flere av våre prosjekter?" 
                : "Want to see more of our projects?"}
            </h3>
            
            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
              {t.nav.about === "Om oss" 
                ? "Vi viser frem et lite utvalg av store prosjekter her på nettsiden vår, men på sosiale medier legger vi ut alt av løpende oppdrag! Sjekk ut sosiale medier for å se hverdagen vår og ferske resultater fra alle arbeidene vi gjør."
                : "We showcase a curated selection of our major projects here on our website, but we upload absolutely everything to our social channels! Check out our social media to see our daily work and fresh results from all our active projects."}
            </p>
          </div>

          {/* Social Media Button Group */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 relative z-10 justify-center">
            <a
              href="https://www.instagram.com/amiribygg.as/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-brand-taupe text-brand-charcoal font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-none border border-white/20 shadow-sm hover:scale-102"
            >
              <Instagram className="w-4 h-4 text-pink-600 sm:text-brand-charcoal" />
              <span>Instagram</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61581097868623"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-charcoal hover:bg-white text-white hover:text-brand-charcoal font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-none border border-white/10 shadow-sm hover:scale-102"
            >
              <Facebook className="w-4 h-4 text-blue-500 sm:text-white" />
              <span>Facebook</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.tiktok.com/@amiri.bygg.as"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-charcoal hover:bg-white text-white hover:text-brand-charcoal font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-none border border-white/10 shadow-sm hover:scale-102"
            >
              <TikTokIcon className="w-4 h-4 text-white sm:text-white hover:text-brand-charcoal" />
              <span>TikTok</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
