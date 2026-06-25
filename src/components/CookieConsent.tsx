import { useState, useEffect } from "react";
import { Shield, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CookieConsentProps {
  lang: "no" | "en";
  onOpenPrivacy: () => void;
}

export default function CookieConsent({ lang, onOpenPrivacy }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("amiri_cookie_consent");
    if (!consent) {
      // Small delay before showing the banner
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("amiri_cookie_consent", "all");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("amiri_cookie_consent", "declined");
    setIsVisible(false);
  };

  const content = {
    no: {
      title: "Vi bryr oss om ditt personvern",
      desc: "Amiri Bygg bruker informasjonskapsler (cookies) for å gi deg en optimal brukeropplevelse på nettsiden vår, analysere trafikk, samt forbedre våre markedsføringstiltak. Ved å klikke «Godta alle» samtykker du til denne bruken.",
      accept: "Godta alle",
      decline: "Avvis",
      policy: "Personvernerklæring",
    },
    en: {
      title: "We care about your privacy",
      desc: "Amiri Bygg uses cookies to provide you with an optimal user experience on our website, analyze site traffic, and improve our marketing efforts. By clicking 'Accept all', you consent to this usage.",
      accept: "Accept all",
      decline: "Decline",
      policy: "Privacy Policy",
    },
  };

  const text = content[lang] || content["no"];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-24 left-4 right-4 sm:left-6 sm:max-w-md lg:left-8 z-50 bg-brand-charcoal text-white p-6 border border-white/10 shadow-2xl rounded-none flex flex-col md:flex-row gap-4 items-start border-l-4 border-l-brand-taupe"
        >
          {/* Main info container */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-brand-taupe" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {text.title}
              </h4>
            </div>
            
            <p className="text-[11px] text-stone-300 font-light leading-relaxed">
              {text.desc}
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-[10px] text-stone-400 hover:text-brand-taupe underline font-mono uppercase tracking-wider bg-transparent border-none p-0 cursor-pointer text-left focus:outline-none"
              >
                {text.policy}
              </button>
            </div>
          </div>

          {/* Accept / Decline buttons container */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 justify-end">
            <button
              id="cookie-accept-all"
              onClick={handleAcceptAll}
              className="bg-brand-taupe hover:bg-white text-brand-charcoal text-[10px] font-bold tracking-widest uppercase py-2.5 px-5 transition-colors duration-300 w-full rounded-none"
            >
              {text.accept}
            </button>
            <button
              id="cookie-decline"
              onClick={handleDecline}
              className="bg-transparent hover:bg-white/10 text-stone-400 hover:text-white border border-stone-700 hover:border-stone-500 text-[10px] font-bold tracking-widest uppercase py-2.5 px-5 transition-colors duration-300 w-full rounded-none"
            >
              {text.decline}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
