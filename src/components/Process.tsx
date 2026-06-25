import { Calendar, Clipboard, Hammer, Key, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { TranslationSchema } from "../translations";

interface ProcessProps {
  t: TranslationSchema;
  scrollToSection: (id: string) => void;
}

export default function Process({ t, scrollToSection }: ProcessProps) {
  const steps = [
    {
      id: "01",
      icon: Calendar,
      title: t.process.step1Title,
      desc: t.process.step1Desc,
      bg: "bg-stone-100",
      iconColor: "text-stone-900",
    },
    {
      id: "02",
      icon: Clipboard,
      title: t.process.step2Title,
      desc: t.process.step2Desc,
      bg: "bg-stone-100",
      iconColor: "text-stone-900",
    },
    {
      id: "03",
      icon: Hammer,
      title: t.process.step3Title,
      desc: t.process.step3Desc,
      bg: "bg-stone-100",
      iconColor: "text-stone-900",
    },
    {
      id: "04",
      icon: Key,
      title: t.process.step4Title,
      desc: t.process.step4Desc,
      bg: "bg-stone-900 text-white",
      iconColor: "text-white",
    },
  ];

  return (
    <section id="process" className="py-24 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-3">
            {t.nav.process}
          </p>
          <h2 className="text-3xl sm:text-4xl font-sans font-semibold tracking-tight text-stone-900 mb-4">
            {t.process.title}
          </h2>
          <div className="w-16 h-1 bg-brand-taupe mx-auto mb-6" />
          <p className="text-stone-600 font-light leading-relaxed text-base">
            {t.process.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connector Line (Desktop only) */}
          <div className="absolute top-1/2 left-[12%] right-[12%] h-[1px] bg-stone-200 -translate-y-[100px] hidden lg:block z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isLast = step.id === "04";
              return (
                <motion.div
                  key={step.id}
                  id={`process-step-${step.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  className="group flex flex-col items-center text-center relative"
                >
                  {/* Step ID / Number Accent */}
                  <div className="absolute -top-6 text-brand-sand font-mono text-7xl font-extrabold select-none group-hover:text-brand-taupe/15 transition-colors z-0">
                    {step.id}
                  </div>

                  {/* Icon Node */}
                  <div className={`relative z-10 w-20 h-20 rounded-none flex items-center justify-center mb-8 border transition-all duration-300 shadow-xs ${
                    isLast 
                      ? "bg-brand-charcoal text-white border-brand-charcoal group-hover:border-brand-taupe" 
                      : "bg-brand-sand text-brand-charcoal border-stone-200 group-hover:border-brand-taupe"
                  }`}>
                    <StepIcon className={`w-8 h-8 transition-colors duration-300 ${isLast ? "text-brand-taupe" : "text-brand-charcoal group-hover:text-brand-taupe"}`} />
                  </div>

                  {/* Copy */}
                  <h3 className="relative z-10 text-sm font-bold uppercase tracking-wider text-brand-charcoal mb-3 font-sans group-hover:text-brand-taupe transition-colors">
                    {step.title}
                  </h3>
                  <p className="relative z-10 text-stone-500 text-xs sm:text-sm font-light leading-relaxed max-w-xs">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Call for Free Inspection */}
        <div className="mt-20 text-center">
          <button
            id="process-cta-btn"
            onClick={() => scrollToSection("contact")}
            className="inline-flex items-center gap-3 bg-brand-charcoal hover:bg-brand-taupe text-white font-bold text-[10px] tracking-widest uppercase py-4.5 px-8 rounded-none transition-colors duration-300 group"
          >
            <span>{t.process.step1Title}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
