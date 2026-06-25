import { useState, useEffect } from "react";
import { Check, Shield, Award, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { TranslationSchema } from "../translations";

interface AboutUsProps {
  t: TranslationSchema;
}

export default function AboutUs({ t }: AboutUsProps) {
  const [aboutImg, setAboutImg] = useState<string>(() => {
    try {
      return localStorage.getItem("amiri_custom_about") || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80";
    } catch {
      return "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80";
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setAboutImg(localStorage.getItem("amiri_custom_about") || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80");
      } catch (err) {
        console.error("Failed to load custom about image", err);
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
    <section id="about" className="py-24 bg-stone-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dual Column Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Story Graphics/Badges */}
          <div className="lg:col-span-5 relative order-last lg:order-first">
            
            {/* Visual Decorative Frame */}
            <div className="relative aspect-[4/5] bg-stone-200 border border-stone-300 shadow-lg overflow-hidden group">
              <img
                src={aboutImg}
                alt="Scandinavian architecture exterior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-900/10" />
            </div>

            {/* Overlapping badge */}
            <div className="absolute -bottom-6 -right-6 md:right-[-30px] bg-brand-charcoal text-white p-8 border border-white/5 shadow-xl max-w-[240px] hidden sm:block rounded-none border-l-4 border-l-brand-taupe">
              <Award className="w-8 h-8 text-brand-taupe mb-4" />
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-2 font-mono text-white">
                {t.nav.about === "Om oss" ? "Kvalitet i alle ledd" : "Uncompromising Quality"}
              </h4>
              <p className="text-stone-400 text-xs font-light leading-relaxed">
                {t.nav.about === "Om oss" 
                  ? "Vi bruker utelukkende godkjente, bærekraftige materialer tilpasset tøffe nordiske forhold." 
                  : "We exclusively use approved, sustainable materials built to withstand harsh Nordic conditions."}
              </p>
            </div>
          </div>
 
          {/* Right Column: Narrative Copy */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-3"
            >
              {t.nav.about}
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-sans font-semibold tracking-tight text-stone-900 mb-6"
            >
              {t.about.subtitle}
            </motion.h2>
 
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-16 h-1 bg-brand-taupe mb-8 origin-left"
            />
 
            <div className="space-y-6 text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>
 
            {/* Micro-badges */}
            <div className="mt-10 pt-8 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-brand-sand border border-stone-200/60 flex items-center justify-center text-brand-taupe">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase text-brand-charcoal tracking-widest">
                  {t.about.badgeQuality}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-brand-sand border border-stone-200/60 flex items-center justify-center text-brand-taupe">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase text-brand-charcoal tracking-widest">
                  {t.about.badgeReliability}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-brand-sand border border-stone-200/60 flex items-center justify-center text-brand-taupe">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase text-brand-charcoal tracking-widest">
                  {t.about.badgeEco}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
