import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationSchema } from "../translations";
import Logo from "./Logo";

interface HeaderProps {
  t: TranslationSchema;
  lang: "no" | "en";
  setLang: (lang: "no" | "en") => void;
  activeSection: string;
  scrollToSection: (id: string) => void;
}

export default function Header({
  t,
  lang,
  setLang,
  activeSection,
  scrollToSection,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "services", label: t.nav.services },
    { id: "portfolio", label: t.nav.portfolio },
    { id: "process", label: t.nav.process },
    { id: "about", label: t.nav.about },
    { id: "careers", label: t.nav.careers },
    { id: "faq", label: t.nav.faq },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <>
      {/* Top Banner (Info & Credentials) */}
      <div className="w-full bg-brand-charcoal text-stone-300 text-[11px] py-2 px-4 sm:px-6 md:px-12 flex justify-between items-center border-b border-white/5 font-mono">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-brand-taupe" />
            <a href="tel:+4790061211" className="hover:text-brand-taupe transition-colors">
              900 61 211
            </a>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-brand-taupe" />
            <a href="mailto:info@amiribygg.no" className="hover:text-brand-taupe transition-colors">
              info@amiribygg.no
            </a>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-1.5 text-brand-taupe">
            <Award className="w-3.5 h-3.5" />
            <span>{lang === "no" ? "Mesterbedrift" : "Master Builder"}</span>
          </span>
          <span className="text-stone-600">•</span>
          <span className="uppercase tracking-widest text-[9px] text-stone-400">Oslo & Viken</span>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        id="app-header"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-stone-100 py-4"
            : "bg-white/90 backdrop-blur-xs border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            id="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
            className="flex items-center gap-2.5 focus:outline-none"
          >
            <Logo className="w-16 h-16" showText={true} lang={lang} variant="full" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                id={`nav-${item.id}`}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors relative py-1.5 focus:outline-none ${
                  activeSection === item.id
                    ? "text-brand-taupe"
                    : "text-brand-charcoal hover:text-brand-taupe"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-taupe"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Action Area (Language & CTA) */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Elegant Language Switcher */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-none border border-stone-200">
              <button
                id="lang-no"
                onClick={() => setLang("no")}
                className={`px-2.5 py-1 text-[10px] font-mono font-medium uppercase transition-all duration-200 ${
                  lang === "no"
                    ? "bg-brand-charcoal text-white"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                NO
              </button>
              <button
                id="lang-en"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 text-[10px] font-mono font-medium uppercase transition-all duration-200 ${
                  lang === "en"
                    ? "bg-brand-charcoal text-white"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                EN
              </button>
            </div>

            {/* Quote/Phone Combo */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] text-stone-400 uppercase tracking-tighter">
                  {lang === "no" ? "Ring oss" : "Call us"}
                </p>
                <a href="tel:+4790061211" className="text-sm font-bold text-brand-charcoal hover:text-brand-taupe transition-colors font-display">
                  900 61 211
                </a>
              </div>
              <button
                id="header-quote-btn"
                onClick={() => scrollToSection("contact")}
                className="bg-brand-charcoal hover:bg-brand-taupe text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-none transition-colors duration-300 focus:outline-none"
              >
                {t.nav.requestQuote}
              </button>
            </div>
          </div>

          {/* Mobile Actions Header Bar */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Quick Lang Switcher on Mobile */}
            <button
              id="mobile-lang-toggle"
              onClick={() => setLang(lang === "no" ? "en" : "no")}
              className="px-2.5 py-1 text-xs font-mono border border-stone-200 rounded-md bg-stone-50 text-stone-700"
            >
              {lang === "no" ? "EN" : "NO"}
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-950 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden absolute top-full left-0 right-0 z-50 border-t border-stone-100 bg-white overflow-hidden shadow-lg"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        scrollToSection(item.id);
                      }, 100);
                    }}
                    className={`block text-base font-medium py-2 border-b border-stone-50 ${
                      activeSection === item.id
                        ? "text-stone-950 font-bold pl-2 border-l-2 border-stone-900"
                        : "text-stone-600 pl-0"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 flex flex-col gap-3">
                  <a
                    id="mobile-call-link"
                    href="tel:+4790061211"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-stone-100 text-stone-900 font-semibold text-sm tracking-wider uppercase"
                  >
                    <Phone className="w-4 h-4" />
                    {t.nav.callUs}: 900 61 211
                  </a>
                  <button
                    id="mobile-quote-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        scrollToSection("contact");
                      }, 100);
                    }}
                    className="w-full py-3 bg-stone-900 text-white font-semibold text-sm tracking-wider uppercase text-center"
                  >
                    {t.nav.requestQuote}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
