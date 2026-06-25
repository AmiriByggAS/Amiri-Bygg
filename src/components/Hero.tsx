import { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, CheckCircle2, Flame, Award } from "lucide-react";
import { motion } from "motion/react";
import { TranslationSchema } from "../translations";

interface HeroProps {
  t: TranslationSchema;
  lang: "no" | "en";
  scrollToSection: (id: string) => void;
}

export default function Hero({ t, lang, scrollToSection }: HeroProps) {
  const [heroImg, setHeroImg] = useState<string>(() => {
    try {
      return localStorage.getItem("amiri_custom_hero") || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90";
    } catch {
      return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90";
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setHeroImg(localStorage.getItem("amiri_custom_hero") || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90");
      } catch (err) {
        console.error("Failed to load custom hero image", err);
      }
    };
    window.addEventListener("amiri_images_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("amiri_images_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-stone-950 text-white overflow-hidden">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Premium Scandinavian Architectural House Built by Amiri Bygg"
          className="w-full h-full object-cover object-center opacity-45 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/30 md:hidden block" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col justify-center h-full">
        <div className="max-w-3xl">
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col mb-4"
          >
            <span className="text-brand-taupe uppercase tracking-[0.3em] text-[10px] font-bold block mb-1">
              {lang === "no" ? "SKANDINAVISK KVALITET" : "SCANDINAVIAN QUALITY"}
            </span>
            <div className="w-12 h-0.5 bg-brand-taupe" />
          </motion.div>
 
          {/* Headline */}
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight text-white mb-6 leading-[1.1] uppercase"
            dangerouslySetInnerHTML={{
              __html: t.hero.headline
                .replace("nøkkelferdig", '<span class="text-brand-taupe">nøkkelferdig</span>')
                .replace("nøkkelferdige", '<span class="text-brand-taupe">nøkkelferdige</span>')
                .replace("turnkey", '<span class="text-brand-taupe">turnkey</span>')
            }}
          />
 
          {/* Subheadline */}
          <motion.p
            id="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-stone-300 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl"
          >
            {t.hero.subheadline}
          </motion.p>
 
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16"
          >
            <button
              id="hero-cta-primary"
              onClick={() => scrollToSection("contact")}
              className="group bg-brand-taupe hover:bg-white text-brand-charcoal font-bold tracking-widest text-[10px] uppercase px-8 py-4.5 rounded-none transition-all duration-350 flex items-center justify-center gap-3 shadow-md"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 text-brand-charcoal transition-transform group-hover:translate-x-1" />
            </button>
            
            <button
              id="hero-cta-secondary"
              onClick={() => scrollToSection("portfolio")}
              className="bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-brand-taupe text-[10px] font-bold tracking-widest uppercase px-8 py-4.5 rounded-none transition-all duration-350 text-center"
            >
              {t.hero.ctaSecondary}
            </button>
          </motion.div>
        </div>
 
        {/* Quality Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-t border-white/10 pt-10 mt-4"
        >
          <div className="flex items-center gap-3.5 group p-4 border border-white/5 bg-white/[0.01] hover:border-brand-taupe/40 transition-colors">
            <div className="flex-shrink-0 w-10 h-10 rounded-none bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-taupe/10 transition-colors">
              <ShieldCheck className="w-5 h-5 text-brand-taupe" />
            </div>
            <div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-stone-500 leading-none mb-1">
                {lang === "no" ? "Sertifisering" : "Certification"}
              </p>
              <h3 className="text-xs font-bold text-white tracking-wide leading-snug uppercase">
                {t.hero.badge1}
              </h3>
            </div>
          </div>
 
          <div className="flex items-center gap-3.5 group p-4 border border-white/5 bg-white/[0.01] hover:border-brand-taupe/40 transition-colors">
            <div className="flex-shrink-0 w-10 h-10 rounded-none bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-taupe/10 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-brand-taupe" />
            </div>
            <div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-stone-500 leading-none mb-1">
                {lang === "no" ? "Standard" : "Standard"}
              </p>
              <h3 className="text-xs font-bold text-white tracking-wide leading-snug uppercase">
                {t.hero.badge2}
              </h3>
            </div>
          </div>
 
          <div className="flex items-center gap-3.5 group p-4 border border-white/5 bg-white/[0.01] hover:border-brand-taupe/40 transition-colors">
            <div className="flex-shrink-0 w-10 h-10 rounded-none bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-taupe/10 transition-colors">
              <Award className="w-5 h-5 text-brand-taupe" />
            </div>
            <div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-stone-500 leading-none mb-1">
                {lang === "no" ? "Trygghet" : "Security"}
              </p>
              <h3 className="text-xs font-bold text-white tracking-wide leading-snug uppercase">
                {t.hero.badge3}
              </h3>
            </div>
          </div>
 
          <div className="flex items-center gap-3.5 group p-4 border border-white/5 bg-white/[0.01] hover:border-brand-taupe/40 transition-colors">
            <div className="flex-shrink-0 w-10 h-10 rounded-none bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-taupe/10 transition-colors">
              <Flame className="w-5 h-5 text-brand-taupe" />
            </div>
            <div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-stone-500 leading-none mb-1">
                {lang === "no" ? "Kompetanse" : "Expertise"}
              </p>
              <h3 className="text-xs font-bold text-white tracking-wide leading-snug uppercase">
                {t.hero.badge4}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modern bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none" />
    </section>
  );
}
