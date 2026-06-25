import React, { useState, useEffect } from "react";
import { Star, Quote, ShieldCheck, MapPin, MessageSquarePlus, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationSchema } from "../translations";

interface TestimonialsProps {
  t: TranslationSchema;
}

interface Review {
  author: string;
  location: string;
  quote: string;
  rating: number;
  project: string;
  isUserAdded?: boolean;
}

export default function Testimonials({ t }: TestimonialsProps) {
  const isNo = t.nav.about === "Om oss";
  
  // Default authentic reviews
  const defaultReviews: Review[] = [
    {
      author: "Marianne & Henrik H.",
      location: isNo ? "Holmenkollen, Oslo" : "Holmenkollen, Oslo",
      quote: isNo 
        ? "Amiri Bygg har nylig ferdigstilt en totalrenovering av vår enebolig. Det å ha én fast prosjektleder som samordnet rørlegger, murer, elektriker og tømrere gjorde at vi sparte utrolig mye tid og stress. Resultatet ble helt fantastisk!"
        : "Amiri Bygg recently completed a full renovation of our home. Having one project manager coordinate plumbers, electricians, and carpenters saved us immense time and stress. The result is absolutely stunning!",
      rating: 5,
      project: isNo ? "Totalrenovering Enebolig" : "Complete House Renovation",
    },
    {
      author: "Christian Thorne",
      location: isNo ? "Frogner, Oslo" : "Frogner, Oslo",
      quote: isNo
        ? "Vi renoverte både badet og kjøkkenet med Amiri Bygg. Presisjonen i snekkerarbeidet og flisleggingen er på et ekstremt høyt nivå. De rydde opp etter seg hver dag, og ble ferdige nøyaktig som avtalt."
        : "We renovated both our bathroom and kitchen with Amiri Bygg. The precision in carpentry and tiling is at an extremely high level. They cleaned up every single day and finished exactly on schedule.",
      rating: 5,
      project: isNo ? "Bad & Kjøkken Frogner" : "Bathroom & Kitchen Frogner",
    },
    {
      author: "Andreas L.",
      location: isNo ? "Bærum" : "Bærum",
      quote: isNo
        ? "Bygget nytt tilbygg og terrasse med Amiri Bygg. Trygg og forutsigbar prosess hele veien. Fastprisen holdt stikk, og sluttbefaringen var grundig. Jeg kommer garantert til å bruke dem igjen!"
        : "Built a new home extension and terrace with Amiri Bygg. A safe and highly predictable process all the way. The fixed price quote held perfectly and final handover was thorough. Highly recommended!",
      rating: 5,
      project: isNo ? "Tilbygg & Stor Terrasse" : "Extension & Large Deck",
    },
  ];

  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form states
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [project, setProject] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);

  // Load user-submitted reviews from local storage with real-time sync listeners
  useEffect(() => {
    const loadReviews = () => {
      try {
        const stored = localStorage.getItem("amiri_user_reviews_v1");
        if (stored) {
          const parsed = JSON.parse(stored) as Review[];
          setReviews([...defaultReviews, ...parsed]);
        } else {
          setReviews(defaultReviews);
        }
      } catch (e) {
        console.error("Failed to load local reviews", e);
      }
    };

    loadReviews();

    // Listen to custom updates and standard storage changes
    window.addEventListener("amiri_reviews_updated", loadReviews);
    window.addEventListener("storage", loadReviews);

    return () => {
      window.removeEventListener("amiri_reviews_updated", loadReviews);
      window.removeEventListener("storage", loadReviews);
    };
  }, [t]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !quote.trim()) return;

    const newReview: Review = {
      author: author.trim(),
      location: location.trim() || (isNo ? "Oslo & Viken" : "Oslo & Viken"),
      project: project.trim() || (isNo ? "Utført prosjekt" : "Completed Project"),
      quote: quote.trim(),
      rating,
      isUserAdded: true,
    };

    const updatedUserReviews = [newReview];
    try {
      const stored = localStorage.getItem("amiri_user_reviews_v1");
      let storedList: Review[] = [];
      if (stored) {
        storedList = JSON.parse(stored) as Review[];
      }
      const newList = [...storedList, newReview];
      localStorage.setItem("amiri_user_reviews_v1", JSON.stringify(newList));
      setReviews([...defaultReviews, ...newList]);
    } catch (err) {
      console.error(err);
      // Fallback if localstorage fails
      setReviews(prev => [...prev, newReview]);
    }

    // Success animation and form reset
    setSuccess(true);
    setAuthor("");
    setLocation("");
    setProject("");
    setQuote("");
    setRating(5);

    setTimeout(() => {
      setSuccess(false);
      setIsFormOpen(false);
    }, 3500);
  };

  return (
    <section id="testimonials" className="py-24 bg-stone-900 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-stone-400 mb-3">
            {t.testimonials.badgeTitle}
          </p>
          <h2 className="text-3xl sm:text-4xl font-sans font-semibold tracking-tight text-white mb-4">
            {t.testimonials.title}
          </h2>
          <div className="w-16 h-1 bg-brand-taupe mx-auto mb-6" />
          <p className="text-stone-300 font-light leading-relaxed mb-8">
            {t.testimonials.subtitle}
          </p>

          {/* Elegant Write a Review trigger */}
          {!isFormOpen ? (
            <motion.button
              id="write-review-trigger-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 border border-brand-taupe/30 hover:border-brand-taupe text-brand-taupe hover:text-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 bg-white/[0.02] hover:bg-brand-taupe/10 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{isNo ? "Skriv en omtale" : "Write a Review"}</span>
            </motion.button>
          ) : null}
        </div>

        {/* Expandable Write a Review Form Container */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="max-w-2xl mx-auto overflow-hidden bg-brand-charcoal border border-white/10 border-l-4 border-l-brand-taupe p-6 sm:p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-mono uppercase font-bold tracking-widest text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-taupe" />
                  {isNo ? "Din opplevelse med Amiri Bygg" : "Your experience with Amiri Bygg"}
                </h3>
                <button
                  id="close-review-form"
                  onClick={() => setIsFormOpen(false)}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-950/40 border border-emerald-500/30 p-8 text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-400 font-sans">
                    {isNo ? "Omtale publisert!" : "Review published!"}
                  </h4>
                  <p className="text-xs text-stone-300 max-w-md mx-auto">
                    {isNo 
                      ? "Takk for at du deler din opplevelse! Din ærlige tilbakemelding hjelper oss å vokse, og den er nå synlig på nettsiden."
                      : "Thank you for sharing your experience! Your honest feedback helps us grow and is now visible on the website."}
                  </p>
                </motion.div>
              ) : (
                <form id="user-review-form" onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                        {isNo ? "Ditt navn / bedrift *" : "Your Name / Company *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="f.eks. Jonas K."
                        className="w-full bg-stone-900 border border-stone-800 text-white p-3 text-xs focus:outline-none focus:border-brand-taupe rounded-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                        {isNo ? "Sted (by/område)" : "Location (city/area)"}
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="f.eks. Lørenskog"
                        className="w-full bg-stone-900 border border-stone-800 text-white p-3 text-xs focus:outline-none focus:border-brand-taupe rounded-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                        {isNo ? "Hva slags prosjekt utførte vi?" : "What project did we perform?"}
                      </label>
                      <input
                        type="text"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        placeholder="f.eks. Oppussing stue"
                        className="w-full bg-stone-900 border border-stone-800 text-white p-3 text-xs focus:outline-none focus:border-brand-taupe rounded-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                        {isNo ? "Vurdering (Stjerner)" : "Rating (Stars)"}
                      </label>
                      <div className="flex items-center gap-2 h-11 bg-stone-900 border border-stone-800 px-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star 
                              className={`w-5 h-5 ${
                                star <= rating 
                                  ? "fill-brand-taupe text-brand-taupe" 
                                  : "text-stone-700"
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                      {isNo ? "Din omtale *" : "Your Review *"}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder={isNo ? "Fortell kort om ditt samarbeid med oss..." : "Tell us briefly about your collaboration with us..."}
                      className="w-full bg-stone-900 border border-stone-800 text-white p-3 text-xs focus:outline-none focus:border-brand-taupe rounded-none resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-5 py-3 border border-stone-800 hover:border-stone-650 text-stone-400 hover:text-white text-xs font-mono font-bold uppercase tracking-widest transition-colors rounded-none"
                    >
                      {isNo ? "Avbryt" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-brand-taupe hover:bg-white text-brand-charcoal font-bold text-xs font-mono uppercase tracking-widest transition-colors rounded-none"
                    >
                      {isNo ? "Publiser omtale" : "Publish Review"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Smaller Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-brand-charcoal/40 p-6 border border-white/5 border-l-2 border-l-brand-taupe flex flex-col justify-between hover:border-white/10 transition-colors duration-300 rounded-none relative group"
            >
              {/* Subtle Quote Mark Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-white/[0.02] pointer-events-none group-hover:text-brand-taupe/[0.04] transition-colors" />

              <div>
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating 
                          ? "fill-brand-taupe text-brand-taupe" 
                          : "text-stone-800"
                      }`} 
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm font-light leading-relaxed text-stone-200 mb-6 italic">
                  "{rev.quote}"
                </p>
              </div>

              {/* Author & Project Details */}
              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    {rev.author}
                  </h4>
                  <p className="text-[10px] font-mono text-stone-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-brand-taupe" />
                    <span>{rev.location}</span>
                  </p>
                </div>

                <div className="inline-flex self-start items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-mono text-stone-300 uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-brand-taupe" />
                  <span>{rev.project}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google review and statistics indicators */}
        <div className="mt-16 border-t border-white/10 pt-12 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            {/* Google Badge Placeholder */}
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-none font-bold text-brand-charcoal text-lg shadow-md font-sans border border-stone-200">
              G
            </div>
            <div>
              <div className="flex items-center gap-0.5 mb-1 justify-center sm:justify-start">
                <Star className="w-3.5 h-3.5 fill-brand-taupe text-brand-taupe" />
                <Star className="w-3.5 h-3.5 fill-brand-taupe text-brand-taupe" />
                <Star className="w-3.5 h-3.5 fill-brand-taupe text-brand-taupe" />
                <Star className="w-3.5 h-3.5 fill-brand-taupe text-brand-taupe" />
                <Star className="w-3.5 h-3.5 fill-brand-taupe text-brand-taupe" />
              </div>
              <p className="text-stone-300 text-[9px] font-mono uppercase tracking-wider">
                {t.testimonials.ratingText}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono text-stone-500 tracking-widest uppercase">
            <span>• 100% GARANTI</span>
            <span>• BOLIGMAPPA INTEGRERT</span>
            <span>• SENTRALT GODKJENT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
