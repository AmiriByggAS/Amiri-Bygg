import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationSchema } from "../translations";

interface PromoModalProps {
  t: TranslationSchema;
  lang: "no" | "en";
  scrollToSection: (id: string) => void;
  setSelectedService: (service: string) => void;
}

export default function PromoModal({ t, lang, scrollToSection, setSelectedService }: PromoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check session storage so it doesn't annoy users on page refreshes during the same session
    const hasSeenPromo = sessionStorage.getItem("amiri_seen_promo");
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3500); // Trigger after 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("amiri_seen_promo", "true");
  };

  const handleAction = () => {
    setIsOpen(false);
    sessionStorage.setItem("amiri_seen_promo", "true");
    setSelectedService("totalrenovering");
    
    // Smooth scroll to the contact form
    setTimeout(() => {
      scrollToSection("contact-form-anchor");
    }, 150);
  };

  const content = {
    no: {
      badge: "EKSKLUSIVT TILBUD",
      title: "Planlegger du renovering i 2026?",
      desc: "Bestill en gratis befaring fra oss i dag, så inkluderer vi komplett 3D-visualisering og skisseforslag av ditt nye rom – verdi kr 5 000,- helt uforpliktende!",
      cta: "Få gratis befaring & skisse",
      subtext: "Gjelder kun for prosjekter i Oslo & Viken.",
    },
    en: {
      badge: "EXCLUSIVE OFFER",
      title: "Planning a renovation in 2026?",
      desc: "Book a free site consultation today, and we will include complete 3D visualization and sketch proposals for your new space – worth NOK 5,000, entirely non-binding!",
      cta: "Get free inspection & sketch",
      subtext: "Valid only for projects in Oslo & Viken.",
    },
  };

  const promo = content[lang] || content["no"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-brand-charcoal text-white max-w-lg w-full overflow-hidden border border-white/10 shadow-2xl z-10 rounded-none flex flex-col"
          >
            {/* Top accent line */}
            <div className="h-1.5 w-full bg-brand-taupe" />

            {/* Close Button */}
            <button
              id="close-promo-modal"
              onClick={handleClose}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors p-1.5 z-20 hover:bg-white/5"
              aria-label="Close promotion"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Area */}
            <div className="p-8 sm:p-10 flex flex-col justify-between relative">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-taupe/5 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 bg-brand-taupe/10 border border-brand-taupe/20 px-3 py-1 mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-brand-taupe" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-taupe">
                    {promo.badge}
                  </span>
                </div>

                {/* Heading */}
                <h3 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight mb-4 text-white leading-tight uppercase">
                  {promo.title}
                </h3>

                {/* Paragraph */}
                <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed mb-8">
                  {promo.desc}
                </p>
              </div>

              {/* Action area */}
              <div className="space-y-4">
                <button
                  id="promo-modal-cta"
                  onClick={handleAction}
                  className="w-full bg-brand-taupe hover:bg-white text-brand-charcoal font-bold text-xs uppercase tracking-widest py-4 transition-colors duration-300 flex items-center justify-center gap-2 rounded-none"
                >
                  <span>{promo.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-stone-500 text-[10px] font-mono tracking-wider uppercase">
                  {promo.subtext}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
