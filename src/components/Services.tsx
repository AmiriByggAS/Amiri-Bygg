import { useState, useEffect } from "react";
import {
  Search,
  Building,
  Paintbrush,
  LayoutGrid,
  Bath,
  Ruler,
  Home,
  Columns,
  Wrench,
  Compass,
  FolderPlus,
  Sparkles,
  Layers,
  Sun,
  Briefcase,
  ClipboardCheck,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationSchema, ServiceDetail } from "../translations";

interface ServicesProps {
  t: TranslationSchema;
  scrollToSection: (id: string) => void;
  setSelectedServiceInForm: (serviceKey: string) => void;
}

export default function Services({
  t,
  scrollToSection,
  setSelectedServiceInForm,
}: ServicesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "construction" | "interior" | "management">("all");
  const [activeDetailKey, setActiveDetailKey] = useState<string | null>(null);

  // Map of service keys to Lucide icons
  const iconMap: Record<string, any> = {
    totalrenovering: Building,
    oppussing: Paintbrush,
    kjokken: LayoutGrid,
    bad: Bath,
    gulv: Ruler,
    tak: Home,
    vegger: Columns,
    innvendig: Wrench,
    utvendig: Compass,
    tilbygg: FolderPlus,
    rehabilitering: Sparkles,
    fasade: Layers,
    terrasse: Sun,
    prosjektledelse: Briefcase,
    totalentreprise: ClipboardCheck,
  };

  // Map of service keys to categories
  const categoryMap: Record<string, "construction" | "interior" | "management"> = {
    totalrenovering: "interior",
    oppussing: "interior",
    kjokken: "interior",
    bad: "interior",
    gulv: "interior",
    tak: "construction",
    vegger: "interior",
    innvendig: "interior",
    utvendig: "construction",
    tilbygg: "construction",
    rehabilitering: "construction",
    fasade: "construction",
    terrasse: "construction",
    prosjektledelse: "management",
    totalentreprise: "management",
  };

  const [customServices, setCustomServices] = useState<Record<string, { title?: string; description?: string; fullDetails?: string; badge?: string; image?: string | null }>>({});

  useEffect(() => {
    const loadCustomServices = () => {
      const customs: typeof customServices = {};
      Object.keys(t.services.items).forEach((key) => {
        const title = localStorage.getItem(`amiri_custom_service_${key}_title`);
        const description = localStorage.getItem(`amiri_custom_service_${key}_description`);
        const fullDetails = localStorage.getItem(`amiri_custom_service_${key}_fullDetails`);
        const badge = localStorage.getItem(`amiri_custom_service_${key}_badge`);
        const image = localStorage.getItem(`amiri_custom_service_${key}_image`);
        if (title !== null || description !== null || fullDetails !== null || badge !== null || image !== null) {
          customs[key] = {
            ...(title && { title }),
            ...(description && { description }),
            ...(fullDetails && { fullDetails }),
            ...(badge !== null && { badge }),
            image: image || null,
          };
        }
      });
      setCustomServices(customs);
    };

    loadCustomServices();
    window.addEventListener("amiri_services_updated", loadCustomServices);
    window.addEventListener("storage", loadCustomServices);
    return () => {
      window.removeEventListener("amiri_services_updated", loadCustomServices);
      window.removeEventListener("storage", loadCustomServices);
    };
  }, [t]);

  const servicesData = Object.entries(t.services.items).map(([key, data]) => {
    const custom = customServices[key] || {};
    return {
      key,
      category: categoryMap[key] || "construction",
      icon: iconMap[key] || Building,
      title: custom.title || data.title,
      description: custom.description || data.description,
      fullDetails: custom.fullDetails || data.fullDetails,
      badge: custom.badge !== undefined ? custom.badge : data.badge,
      image: custom.image || null,
    };
  });

  const filteredServices = servicesData.filter((svc) => {
    const matchesSearch =
      svc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      svc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || svc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleServiceSelect = (key: string) => {
    setSelectedServiceInForm(key);
    scrollToSection("contact");
  };

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-3">
            {t.nav.services}
          </p>
          <h2 className="text-3xl sm:text-4xl font-sans font-semibold tracking-tight text-stone-900 mb-4">
            {t.services.title}
          </h2>
          <div className="w-16 h-1 bg-brand-taupe mx-auto mb-6" />
          <p className="text-stone-600 font-light leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* Controls: Category Filter + Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 mb-12 pb-8 border-b border-stone-100">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              id="cat-all"
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-none ${
                selectedCategory === "all"
                  ? "bg-brand-charcoal text-white"
                  : "bg-brand-sand hover:bg-brand-cream text-stone-600 border border-stone-200"
              }`}
            >
              {t.services.allCategories}
            </button>
            <button
              id="cat-construction"
              onClick={() => setSelectedCategory("construction")}
              className={`px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-none ${
                selectedCategory === "construction"
                  ? "bg-brand-charcoal text-white"
                  : "bg-brand-sand hover:bg-brand-cream text-stone-600 border border-stone-200"
              }`}
            >
              {t.services.catConstruction}
            </button>
            <button
              id="cat-interior"
              onClick={() => setSelectedCategory("interior")}
              className={`px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-none ${
                selectedCategory === "interior"
                  ? "bg-brand-charcoal text-white"
                  : "bg-brand-sand hover:bg-brand-cream text-stone-600 border border-stone-200"
              }`}
            >
              {t.services.catInterior}
            </button>
            <button
              id="cat-management"
              onClick={() => setSelectedCategory("management")}
              className={`px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200 rounded-none ${
                selectedCategory === "management"
                  ? "bg-brand-charcoal text-white"
                  : "bg-brand-sand hover:bg-brand-cream text-stone-600 border border-stone-200"
              }`}
            >
              {t.services.catManagement}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
            <input
              id="service-search-input"
              type="text"
              placeholder={t.services.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-sand border border-stone-200 py-3 pl-12 pr-4 text-sm rounded-none focus:outline-none focus:border-stone-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((svc) => {
              const SvcIcon = svc.icon;
              const isDetailOpen = activeDetailKey === svc.key;
              
              return (
                <motion.div
                  key={svc.key}
                  id={`service-card-${svc.key}`}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className={`border p-8 flex flex-col justify-between transition-all duration-300 relative group rounded-none ${
                    isDetailOpen
                      ? "border-brand-taupe bg-brand-charcoal text-white shadow-lg lg:col-span-1"
                      : "border-stone-200 hover:border-brand-taupe bg-white text-brand-charcoal hover:shadow-xs"
                  }`}
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <span className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 ${
                        isDetailOpen
                          ? "bg-white/10 text-brand-taupe border border-white/10"
                          : "bg-brand-sand text-stone-600 border border-stone-200/40 group-hover:bg-brand-taupe group-hover:text-brand-charcoal group-hover:border-brand-taupe transition-colors"
                      }`}>
                        {svc.badge}
                      </span>
                      <span className="text-[10px] font-mono font-light uppercase tracking-widest text-stone-400">
                        {svc.category === "management" ? "PM" : svc.category === "interior" ? "INT" : "CON"}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-10 h-10 flex items-center justify-center transition-colors ${
                        isDetailOpen ? "bg-brand-taupe text-brand-charcoal" : "bg-brand-sand text-brand-taupe group-hover:bg-brand-taupe group-hover:text-white"
                      }`}>
                        <SvcIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold uppercase tracking-wider font-sans">
                        {svc.title}
                      </h3>
                    </div>

                    {svc.image && (
                      <div className="aspect-[21/9] w-full relative mb-4 overflow-hidden border border-stone-200/40 bg-stone-100">
                        <img
                          src={svc.image}
                          alt={svc.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Description */}
                    <p className={`text-xs sm:text-sm font-light leading-relaxed mb-6 ${
                      isDetailOpen ? "text-stone-300" : "text-stone-500"
                    }`}>
                      {isDetailOpen ? svc.fullDetails : svc.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                    <button
                      id={`service-toggle-details-${svc.key}`}
                      onClick={() => setActiveDetailKey(isDetailOpen ? null : svc.key)}
                      className={`text-xs font-mono tracking-widest uppercase flex items-center gap-1.5 transition-colors focus:outline-none ${
                        isDetailOpen
                          ? "text-stone-300 hover:text-white"
                          : "text-stone-500 hover:text-brand-charcoal"
                      }`}
                    >
                      <span>{isDetailOpen ? (t.nav.about === "Om oss" ? "Lukk" : "Close") : (t.nav.about === "Om oss" ? "Les mer" : "Read more")}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isDetailOpen ? "rotate-90 text-white" : ""}`} />
                    </button>

                    <button
                      id={`service-select-quote-${svc.key}`}
                      onClick={() => handleServiceSelect(svc.key)}
                      className={`text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 transition-all duration-300 rounded-none ${
                        isDetailOpen
                          ? "bg-brand-taupe text-brand-charcoal border-brand-taupe hover:bg-white"
                          : "bg-brand-charcoal hover:bg-brand-taupe text-white border-brand-charcoal"
                      }`}
                    >
                      {t.nav.requestQuote.split(" ")[0]}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Quick Quote CTA Banner */}
        <div className="mt-20 bg-brand-charcoal text-white p-8 md:p-12 border-l-4 border-brand-taupe relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.01] rounded-full blur-3xl pointer-events-none opacity-50" />
          <div className="relative z-10 max-w-xl">
            <h3 className="text-xl md:text-2xl font-sans font-bold uppercase tracking-wide mb-2">
              {t.services.quickQuoteTitle}
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
              {t.services.quickQuoteDesc}
            </p>
          </div>
          <button
            id="services-quote-action"
            onClick={() => {
              setSelectedServiceInForm("totalrenovering");
              scrollToSection("contact");
            }}
            className="relative z-10 flex-shrink-0 bg-brand-taupe hover:bg-white text-brand-charcoal text-[10px] font-bold tracking-widest uppercase py-4.5 px-8 rounded-none transition-colors duration-300 flex items-center gap-2 group shadow-md"
          >
            <span>{t.nav.requestQuote}</span>
            <ArrowRight className="w-4 h-4 text-brand-charcoal transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
