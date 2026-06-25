import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationSchema } from "../translations";

interface FAQProps {
  t: TranslationSchema;
}

export default function FAQ({ t }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white border-b border-stone-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-3">
            {t.nav.faq}
          </p>
          <h2 className="text-3xl sm:text-4xl font-sans font-semibold tracking-tight text-stone-900 mb-4">
            {t.faq.title}
          </h2>
          <div className="w-16 h-1 bg-brand-taupe mx-auto mb-6" />
          <p className="text-stone-600 font-light leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                id={`faq-item-${idx}`}
                className={`border transition-all duration-300 rounded-none ${
                  isOpen 
                    ? "border-brand-taupe border-l-4 border-l-brand-taupe bg-brand-sand shadow-xs" 
                    : "border-stone-200 bg-white hover:border-brand-taupe"
                }`}
              >
                {/* Header Button */}
                <button
                  id={`faq-header-btn-${idx}`}
                  onClick={() => handleToggle(idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle className={`w-4 h-4 flex-shrink-0 ${isOpen ? "text-brand-taupe" : "text-stone-400"}`} />
                    <span className="text-sm sm:text-base font-semibold text-brand-charcoal font-sans">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-stone-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-taupe" : ""}`} />
                </button>

                {/* Answer Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-panel-${idx}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-stone-200/40 text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
