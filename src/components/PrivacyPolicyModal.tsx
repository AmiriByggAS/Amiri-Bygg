import { X, Shield, Lock, Eye, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "no" | "en";
}

export default function PrivacyPolicyModal({ isOpen, onClose, lang }: PrivacyPolicyModalProps) {
  const content = {
    no: {
      title: "Personvernerklæring & Cookies",
      subtitle: "Amiri Bygg AS — Org.nr 936 342 450 MVA",
      intro: "Ditt personvern er viktig for oss. Denne personvernerklæringen forklarer hvordan Amiri Bygg AS samler inn, bruker, og beskytter dine personopplysninger i tråd med den norske personopplysningsloven og EUs personvernforordning (GDPR).",
      
      sections: [
        {
          icon: <Shield className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "1. Behandlingsansvarlig",
          text: "Behandlingsansvarlig for personopplysningene vi behandler er Amiri Bygg AS, ved daglig leder. For spørsmål angående ditt personvern eller utøvelse av dine rettigheter, kan du kontakte oss på e-post: info@amiribygg.no eller postadresse: Viggo Hansteens vei 22, 1472 Fjellhamar."
        },
        {
          icon: <FileText className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "2. Hvilke opplysninger samler vi inn?",
          text: "Vi samler inn og behandler personopplysninger i følgende situasjoner:\n\n• Kontakt- og tilbudsforespørsler: Navn, e-postadresse, telefonnummer, detaljer om ditt byggeprosjekt, budsjett, og eventuelle vedlegg/skisser du sender inn.\n• Jobbsøknader og rekruttering: Navn, e-post, telefonnummer, CV-dokumenter, søknadstekst og erfaringsdetaljer."
        },
        {
          icon: <Lock className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "3. Formål og rettslig grunnlag",
          text: "Vi behandler opplysningene basert på:\n\n• Samtykke (GDPR art. 6 nr. 1 a): Når du godtar informasjonskapsler eller samtykker til å sende oss henvendelser.\n• Avtale/tiltak før avtaleinngåelse (GDPR art. 6 nr. 1 b): For å svare på tilbudsforespørsler, utføre gratis befaring, eller behandle din jobbsøknad.\n• Berettiget interesse (GDPR art. 6 nr. 1 f): For å forbedre og feilsøke nettsiden vår."
        },
        {
          icon: <Eye className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "4. Informasjonskapsler (Cookies) & Sporing",
          text: "I samsvar med ekomloven § 2-7b bruker denne nettsiden informasjonskapsler (cookies) for å optimere brukervennligheten, analysere trafikk, og huske dine valg. Du kan når som helst avvise eller endre samtykket ditt via informasjonskapsel-banneret nederst på skjermen eller ved å tømme nettleserdataene dine. Vi lagrer dine valg lokalt i nettleseren din (localStorage)."
        },
        {
          icon: <Shield className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "5. Lagringstid og Datasikkerhet",
          text: "Vi lagrer dine personopplysninger kun så lenge det er nødvendig for å oppfylle formålet med innsamlingen (f.eks. så lenge en tilbuds- eller søknadsprosess pågår, eller i henhold til bokføringslovens krav). Vi bruker moderne kryptering, brannmurer og strenge adgangskontroller for å hindre uautorisert tilgang eller tap av dine data."
        },
        {
          icon: <FileText className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "6. Dine rettigheter",
          text: "Som registrert har du omfattende rettigheter etter personvernforordningen:\n\n• Rett til innsyn i egne opplysninger.\n• Rett til korrigering av ufullstendige eller uriktige opplysninger.\n• Rett til sletting av dine opplysninger («retten til å bli glemt»).\n• Rett til begrensning av eller protest mot behandling.\n• Rett til å trekke tilbake eventuelle samtykker når som helst.\n\nDu har også rett til å klage til Datatilsynet dersom du mener vår behandling strider mot personvernreglene."
        }
      ],
      close: "Lukk personvernerklæring"
    },
    en: {
      title: "Privacy Policy & Cookies",
      subtitle: "Amiri Bygg AS — Org.no 936 342 450 MVA",
      intro: "Your privacy is important to us. This privacy policy explains how Amiri Bygg AS collects, uses, and protects your personal data in accordance with the Norwegian Personal Data Act and the EU General Data Protection Regulation (GDPR).",
      
      sections: [
        {
          icon: <Shield className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "1. Data Controller",
          text: "The data controller for the personal data we process is Amiri Bygg AS, represented by the Managing Director. For questions regarding your privacy or to exercise your rights, please contact us by email: info@amiribygg.no or mailing address: Viggo Hansteens vei 22, 1472 Fjellhamar."
        },
        {
          icon: <FileText className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "2. What Information Do We Collect?",
          text: "We collect and process personal data in the following scenarios:\n\n• Contact & Quote Inquiries: Name, email address, phone number, details about your construction project, budget, and any attachments/sketches submitted.\n• Job Applications & Recruitment: Name, email, phone number, resume/CV documents, cover letter, and experience details."
        },
        {
          icon: <Lock className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "3. Purpose and Legal Basis",
          text: "We process the information based on:\n\n• Consent (GDPR Art. 6(1)(a)): When you accept cookies or consent to submit inquiries to us.\n• Contract / Pre-contractual measures (GDPR Art. 6(1)(b)): To reply to quotes, conduct free site inspections, or process your job application.\n• Legitimate Interest (GDPR Art. 6(1)(f)): To improve and troubleshoot our website performance."
        },
        {
          icon: <Eye className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "4. Cookies & Tracking",
          text: "In accordance with section 2-7b of the Norwegian Electronic Communications Act (ekomloven), this website uses cookies to optimize usability, analyze traffic, and remember your choices. You can reject or change your consent at any time via the cookie banner at the bottom of the screen or by clearing your browser cache. We store your choices locally in your browser (localStorage)."
        },
        {
          icon: <Shield className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "5. Retention Period & Data Security",
          text: "We store your personal data only as long as necessary to fulfill the purpose of collection (e.g., during active bidding or recruitment procedures, or to satisfy legal bookkeeping requirements). We deploy modern encryption, firewalls, and strict access controls to prevent unauthorized access or data loss."
        },
        {
          icon: <FileText className="w-4 h-4 text-brand-taupe shrink-0 mt-0.5" />,
          title: "6. Your Rights",
          text: "As a data subject, you hold comprehensive rights under the GDPR regulations:\n\n• Right of access to your personal data.\n• Right to rectification of incomplete or incorrect data.\n• Right to erasure ('the right to be forgotten').\n• Right to restriction of or objection to processing.\n• Right to withdraw your consent at any time.\n\nYou also have the right to lodge a complaint with the Norwegian Data Protection Authority (Datatilsynet) if you believe our processing violates privacy regulations."
        }
      ],
      close: "Close Privacy Policy"
    }
  };

  const t = content[lang] || content["no"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-brand-charcoal text-white max-w-2xl w-full h-[85vh] sm:h-[75vh] flex flex-col border border-white/10 shadow-2xl rounded-none"
          >
            {/* Top accent line */}
            <div className="h-1.5 w-full bg-brand-taupe shrink-0" />

            {/* Header */}
            <div className="p-6 border-b border-white/5 relative shrink-0">
              <button
                id="close-privacy-modal"
                onClick={onClose}
                className="absolute top-6 right-6 text-stone-400 hover:text-white transition-colors p-1.5 hover:bg-white/5"
                aria-label="Close privacy policy"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg sm:text-xl font-sans font-bold uppercase tracking-wider text-white">
                {t.title}
              </h3>
              <p className="text-[10px] text-brand-taupe font-mono tracking-widest uppercase mt-1">
                {t.subtitle}
              </p>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-sans text-xs sm:text-sm text-stone-300 font-light space-y-6 scrollbar-thin">
              <p className="leading-relaxed border-l-2 border-brand-taupe pl-4 text-stone-200">
                {t.intro}
              </p>

              <div className="space-y-6 pt-2">
                {t.sections.map((section, idx) => (
                  <div key={idx} className="space-y-2 bg-stone-900/30 border border-white/5 p-4 rounded-none">
                    <div className="flex items-center gap-2">
                      {section.icon}
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                        {section.title}
                      </h4>
                    </div>
                    <p className="text-[11px] sm:text-xs text-stone-400 font-light leading-relaxed whitespace-pre-line pl-6">
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Area */}
            <div className="p-6 border-t border-white/5 shrink-0 bg-stone-950 flex justify-end">
              <button
                id="privacy-modal-close-btn"
                onClick={onClose}
                className="bg-brand-taupe hover:bg-white text-brand-charcoal text-[10px] font-bold tracking-widest uppercase py-3 px-6 transition-all duration-300 rounded-none cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
