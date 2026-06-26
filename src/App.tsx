import { useState, useEffect } from "react";
import { Phone, Calendar, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { translations } from "./translations";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Trust from "./components/Trust";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import Testimonials from "./components/Testimonials";
import AboutUs from "./components/AboutUs";
import Recruitment from "./components/Recruitment";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";
import PromoModal from "./components/PromoModal";
import CookieConsent from "./components/CookieConsent";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import { syncGlobalMediaToLocal } from "./lib/firebase";

export default function App() {
  const [lang, setLang] = useState<"no" | "en">("no");
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedService, setSelectedService] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminRefreshCounter, setAdminRefreshCounter] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const t = translations[lang];

  // Synchronize Firestore media settings to localStorage on app boot
  useEffect(() => {
    const fetchGlobalMedia = async () => {
      try {
        await syncGlobalMediaToLocal();
        // Notify components that local cache has been updated from the cloud
        window.dispatchEvent(new Event("amiri_images_updated"));
        window.dispatchEvent(new Event("amiri_logo_updated"));
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("Failed to fetch global media settings:", err);
      }
    };
    fetchGlobalMedia();
  }, []);

  // Dynamic Favicon sync with custom uploaded logo
  useEffect(() => {
    const updateFavicon = () => {
      try {
        const customLogo = localStorage.getItem("amiri_custom_logo");
        let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!faviconLink) {
          faviconLink = document.createElement("link");
          faviconLink.rel = "icon";
          document.head.appendChild(faviconLink);
        }
        if (customLogo) {
          faviconLink.href = customLogo;
          faviconLink.type = customLogo.startsWith("data:image/svg+xml") ? "image/svg+xml" : "image/png";
        } else {
          // Fallback beautiful SVG logo
          faviconLink.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23FFFFFF' stroke='%230B2240' stroke-width='6'/%3E%3Cpath d='M 100,68 L 155,115 L 155,122 L 141,122 L 141,115 L 100,80 L 59,115 L 59,122 L 45,122 L 45,115 Z' fill='%230B2240'/%3E%3Cpath d='M 100,83 L 138,115 L 138,122 L 125,122 L 125,115 L 100,95 L 75,115 L 75,122 L 62,122 L 62,115 Z' fill='%230B2240'/%3E%3Crect x='41' y='123' width='118' height='6' fill='%23EE9D26'/%3E%3C/svg%3E";
          faviconLink.type = "image/svg+xml";
        }
      } catch (err) {
        console.error("Failed to update favicon:", err);
      }
    };

    updateFavicon();
    window.addEventListener("amiri_logo_updated", updateFavicon);
    window.addEventListener("storage", updateFavicon);
    return () => {
      window.removeEventListener("amiri_logo_updated", updateFavicon);
      window.removeEventListener("storage", updateFavicon);
    };
  }, []);

  // Section scroll-tracking hook
  useEffect(() => {
    const sections = ["hero", "trust", "services", "portfolio", "process", "about", "careers", "faq", "contact"];
    const handleScroll = () => {
      // scroll to top visibility
      setShowScrollTop(window.scrollY > 500);

      const scrollPosition = window.scrollY + 250;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            // For nav active highlights, map 'trust' back to 'about' or show as is
            if (sectionId === "trust") {
              setActiveSection("about");
            } else {
              setActiveSection(sectionId);
            }
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 95; // height of our sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Syncing submitted leads/applications back to admin tables
  const handleNewSubmission = () => {
    setAdminRefreshCounter((prev) => prev + 1);
  };

  return (
    <div id="amiri-bygg-website" className="min-h-screen bg-stone-50 font-sans text-stone-900 scroll-smooth selection:bg-stone-900 selection:text-white">
      {/* Dynamic Header */}
      <Header
        t={t}
        lang={lang}
        setLang={setLang}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      {/* Main Sections Cascade */}
      <main>
        {/* Hero Section */}
        <Hero t={t} lang={lang} scrollToSection={scrollToSection} />

        {/* Why Choose Us (Trust) */}
        <Trust t={t} />

        {/* Services Showcase */}
        <Services
          t={t}
          scrollToSection={scrollToSection}
          setSelectedServiceInForm={(key) => {
            setSelectedService(key);
            scrollToSection("contact-form-anchor");
          }}
        />

        {/* Interactive Portfolio & Before/After */}
        <Portfolio t={t} />

        {/* Work Process (4 Steps) */}
        <Process t={t} scrollToSection={scrollToSection} />

        {/* Testimonial slider */}
        <Testimonials t={t} />

        {/* About Company story */}
        <AboutUs t={t} />

        {/* Career & Recruitment Application form */}
        <Recruitment t={t} onNewApplicationSubmitted={handleNewSubmission} />

        {/* Accordion FAQ */}
        <FAQ t={t} />

        {/* Interactive Contact Form & Maps */}
        <Contact
          t={t}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          onNewLeadSubmitted={handleNewSubmission}
        />

        {/* Company Admin Lead Dashboard (Reviewer Utility Portal) */}
        <AnimatePresence>
          {showAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <AdminDashboard t={t} lang={lang} refreshCounter={adminRefreshCounter} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Structured Footer */}
      <Footer
        t={t}
        lang={lang}
        scrollToSection={scrollToSection}
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* FLOATING ACTION OVERLAYS FOR SMART CONVERSIONS */}
      
      {/* 1. Mobile-only Floating calling & quote widget (stickies to screen bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-3 px-4 flex items-center justify-between gap-3 lg:hidden shadow-lg">
        <a
          id="mobile-floating-call"
          href="tel:+4790061211"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-100 text-stone-900 font-bold text-xs uppercase tracking-wider hover:bg-stone-200 transition-colors"
        >
          <Phone className="w-4 h-4 text-stone-800" />
          <span>{lang === "no" ? "Ring" : "Call"}</span>
        </a>

        <button
          id="mobile-floating-quote"
          onClick={() => scrollToSection("contact")}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-850 transition-colors"
        >
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>{t.nav.requestQuote.split(" ")[0]}</span>
        </button>
      </div>

      {/* 2. Floating Scroll-To-Top bubble */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-20 right-6 lg:bottom-8 lg:right-8 z-45 w-11 h-11 bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 border border-stone-800 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Premium Creative Promotion Modal */}
      <PromoModal
        t={t}
        lang={lang}
        scrollToSection={scrollToSection}
        setSelectedService={setSelectedService}
      />

      {/* GDPR Cookie Consent Banner */}
      <CookieConsent lang={lang} onOpenPrivacy={() => setIsPrivacyOpen(true)} />

      {/* Legal GDPR Privacy Policy Overlay */}
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} lang={lang} />
    </div>
  );
}
