import { Phone, Mail, MapPin, Award, CheckCircle, Facebook, Instagram } from "lucide-react";
import { TranslationSchema } from "../translations";
import Logo from "./Logo";

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.5-.77-.57-1.39-1.33-1.81-2.2v9.33c0 1.95-.51 3.91-1.66 5.5-1.42 1.95-3.83 3.03-6.23 2.82-2.58-.23-4.99-1.89-6.07-4.24-1.21-2.6-1.02-5.88.66-8.25 1.43-2.02 3.92-3.14 6.38-2.92.01 1.41-.01 2.82 0 4.22-1.38-.11-2.88.38-3.69 1.55-.83 1.22-.84 2.94-.01 4.15.82 1.19 2.37 1.72 3.73 1.39 1.17-.29 2.05-1.33 2.16-2.54.02-2.31.01-4.63.01-6.94V0h4.09c-.01.01-.01.01-.02.02z"/>
  </svg>
);

interface FooterProps {
  t: TranslationSchema;
  lang: "no" | "en";
  scrollToSection: (id: string) => void;
  showAdmin: boolean;
  setShowAdmin: (show: boolean) => void;
  onOpenPrivacy?: () => void;
}

export default function Footer({
  t,
  lang,
  scrollToSection,
  showAdmin,
  setShowAdmin,
  onOpenPrivacy,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-stone-950 text-stone-400 text-sm py-16 border-t border-stone-900 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <Logo className="w-20 h-20" showText={true} lang={lang} isDarkBg={true} variant="full" />
            
            <p className="text-stone-400 text-xs font-light leading-relaxed max-w-xs">
              {lang === "no"
                ? "Totalleverandør av renovering- og byggetjenester i Oslo og Viken. Vi tar prosjektet ditt trygt fra idé til ferdigstillelse."
                : "A complete turnkey provider for high-end renovation and construction services in Oslo & Viken. We manage your vision seamlessly."}
            </p>

            <div className="flex items-center gap-2 pt-2 text-stone-300">
              <Award className="w-5 h-5 text-brand-taupe" />
              <span className="text-xs font-mono tracking-widest uppercase font-bold">
                {lang === "no" ? "MESTERBEDRIFT" : "MASTER BUILDER"}
              </span>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 flex items-center gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61581097868623"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-none border border-stone-800 hover:border-brand-taupe flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-900 transition-all duration-300"
                aria-label="Amiri Bygg on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/amiribygg.as/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-none border border-stone-800 hover:border-brand-taupe flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-900 transition-all duration-300"
                aria-label="Amiri Bygg on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@amiri.bygg.as"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-none border border-stone-800 hover:border-brand-taupe flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-900 transition-all duration-300"
                aria-label="Amiri Bygg on TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-6 font-semibold">
              {lang === "no" ? "Snarveier" : "Quick Links"}
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <button
                  id="footer-link-services"
                  onClick={() => scrollToSection("services")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-portfolio"
                  onClick={() => scrollToSection("portfolio")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.portfolio}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-process"
                  onClick={() => scrollToSection("process")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.process}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => scrollToSection("about")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-careers"
                  onClick={() => scrollToSection("careers")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.careers}
                </button>
              </li>
              <li>
                <button
                  id="footer-link-faq"
                  onClick={() => scrollToSection("faq")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.faq}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Opening Hours & Service Coverage */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-6 font-semibold">
              {lang === "no" ? "Åpningstider" : "Operating Hours"}
            </h4>
            <ul className="space-y-3 text-xs font-light text-stone-400">
              <li className="flex justify-between border-b border-stone-900 pb-1.5">
                <span>{lang === "no" ? "Mandag - Fredag" : "Monday - Friday"}</span>
                <span className="font-mono text-white">08:00 - 18:00</span>
              </li>
              <li className="flex justify-between border-b border-stone-900 pb-1.5">
                <span>{lang === "no" ? "Lørdag" : "Saturday"}</span>
                <span className="font-mono text-stone-300">{lang === "no" ? "Etter avtale" : "By agreement"}</span>
              </li>
              <li className="flex justify-between pb-1.5">
                <span>{lang === "no" ? "Søndag" : "Sunday"}</span>
                <span className="font-mono text-stone-500">{lang === "no" ? "Stengt" : "Closed"}</span>
              </li>
              <li className="pt-2 text-[10px] text-brand-taupe flex items-center gap-1.5 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{lang === "no" ? "Døgnåpen vakt ved lekkasje" : "24/7 emergency water damage support"}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-6 font-semibold">
              {lang === "no" ? "Kontaktinfo" : "Contact Details"}
            </h4>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-stone-500 mt-0.5 flex-shrink-0" />
                <span>Viggo Hansteens vei 22, 1472 Fjellhamar</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-stone-500 flex-shrink-0" />
                <a href="tel:+4745513415" className="hover:text-white transition-colors">
                  455 13 415
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-stone-500 flex-shrink-0" />
                <a href="mailto:info@amiribygg.no" className="hover:text-white transition-colors">
                  info@amiribygg.no
                </a>
              </li>
              <li className="text-[10px] text-stone-500 font-mono">
                Org.nr: 936 342 450 MVA
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Base / Copyright & Admin Trigger */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-600">
          <p className="flex flex-wrap items-center gap-2">
            <span>&copy; {currentYear} Amiri Bygg AS. {lang === "no" ? "Alle rettigheter reservert." : "All rights reserved."}</span>
            {onOpenPrivacy && (
              <>
                <span className="text-stone-800">•</span>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-stone-400 underline cursor-pointer focus:outline-none"
                >
                  {lang === "no" ? "Personvernerklæring" : "Privacy Policy"}
                </button>
              </>
            )}
          </p>

          <div className="flex items-center gap-4 font-mono">
            {/* Elegant Hidden Admin Portal Trigger */}
            <button
              id="footer-admin-toggle"
              onClick={() => {
                setShowAdmin(!showAdmin);
                if (!showAdmin) {
                  setTimeout(() => {
                    document.getElementById("admin-panel")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                } else {
                  scrollToSection("hero");
                }
              }}
              className={`hover:text-stone-300 transition-colors uppercase text-[10px] tracking-wider border px-2.5 py-1 ${
                showAdmin ? "text-brand-taupe border-brand-taupe/30" : "text-stone-700 border-stone-850 hover:border-brand-taupe"
              }`}
            >
              {showAdmin ? "[ CLOSE ADMIN ]" : "[ COMPANY PORTAL ]"}
            </button>
            <span>•</span>
            <span className="text-[10px]">Boligmappa.no partner</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
