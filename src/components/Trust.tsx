import { ShieldCheck, CalendarRange, Hammer, Award, UserCheck, DollarSign, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { TranslationSchema } from "../translations";

interface TrustProps {
  t: TranslationSchema;
}

export default function Trust({ t }: TrustProps) {
  const points = [
    {
      icon: Award,
      title: t.trust.card1Title,
      desc: t.trust.card1Desc,
    },
    {
      icon: CalendarRange,
      title: t.trust.card2Title,
      desc: t.trust.card2Desc,
    },
    {
      icon: Hammer,
      title: t.trust.card3Title,
      desc: t.trust.card3Desc,
    },
    {
      icon: ShieldCheck,
      title: t.trust.card4Title,
      desc: t.trust.card4Desc,
    },
    {
      icon: UserCheck,
      title: t.trust.card5Title,
      desc: t.trust.card5Desc,
    },
    {
      icon: DollarSign,
      title: t.trust.card6Title,
      desc: t.trust.card6Desc,
    },
  ];

  const stats = [
    { value: "250+", label: t.trust.stat1Label },
    { value: "98%", label: t.trust.stat2Label },
    { value: "10", label: t.trust.stat3Label },
    { value: "2M NOK", label: t.trust.stat4Label },
  ];

  return (
    <section id="trust" className="py-24 bg-stone-50 border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            className="text-3xl sm:text-4xl font-sans font-semibold tracking-tight text-stone-900 mb-4"
          >
            {t.trust.title}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-16 h-1 bg-brand-taupe mx-auto mb-6 origin-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 font-light leading-relaxed text-base"
          >
            {t.trust.subtitle}
          </motion.p>
        </div>
 
        {/* Bento Trust Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {points.map((pt, idx) => {
            const IconComponent = pt.icon;
            return (
              <motion.div
                key={idx}
                id={`trust-card-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white p-8 border border-stone-200 hover:border-brand-taupe transition-all duration-300 relative group flex flex-col justify-between rounded-none shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-6 h-6 text-brand-charcoal group-hover:text-brand-taupe transition-colors duration-300" />
                    <div className="w-12 h-1 bg-stone-100 group-hover:bg-brand-taupe transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-brand-charcoal mb-3 font-sans">
                    {pt.title}
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-stone-400 uppercase pt-4 border-t border-stone-50">
                  <span>AMIRI STANDARD</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>
 
        {/* Counter / Stats Section - Styled like the col-span-8 design block */}
        <div className="bg-white border border-stone-200 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full relative z-10">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-left border-l border-stone-200 pl-6 first:border-0 first:pl-0"
              >
                <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-brand-charcoal mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400 font-sans leading-relaxed">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-brand-taupe" />
        </div>
      </div>
    </section>
  );
}
