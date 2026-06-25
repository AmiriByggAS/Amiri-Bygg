import React, { useState, useEffect } from "react";
import { 
  Folder, Users, Star, Trash2, CheckCircle, Clock, ShieldAlert, 
  Database, RefreshCw, Upload, Image, Lock, Unlock, Settings, 
  HelpCircle, Eye, Sliders, Check, FileImage 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationSchema } from "../translations";

interface AdminDashboardProps {
  t: TranslationSchema;
  lang: "no" | "en";
  refreshCounter: number;
}

export default function AdminDashboard({ t, lang, refreshCounter }: AdminDashboardProps) {
  // Authentication State
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem("amiri_admin_authenticated") === "true";
    } catch {
      return false;
    }
  });
  const [authError, setAuthError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"leads" | "media">("leads");

  // Core Data
  const [leads, setLeads] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);

  // Media Management State (Base64 references from LocalStorage)
  const [mediaPreviews, setMediaPreviews] = useState<Record<string, string | null>>({});
  const [uploadLoading, setUploadLoading] = useState<Record<string, boolean>>({});

  const loadData = () => {
    // Initial Seed Leads
    const savedLeads = localStorage.getItem("amiri_leads");
    if (!savedLeads) {
      const defaultLeads = [
        {
          id: 1,
          name: "Johannes Kleven",
          email: "johs@kleven-eiendom.no",
          phone: "912 34 567",
          service: "totalentreprise",
          budget: "over-1m",
          message: lang === "no" 
            ? "Ønsker befaring for totalentreprise på en ny tomannsbolig i Bærum. Tegninger er klare fra arkitekt."
            : "Requesting site inspection for a new semi-detached house project in Bærum. Architectural drawings ready.",
          filesCount: 2,
          submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          status: "pending",
        },
        {
          id: 2,
          name: "Siri Marstein",
          email: "siri@marstein.design",
          phone: "481 00 221",
          service: "bad",
          budget: "100k-500k",
          message: lang === "no"
            ? "Vil renovere hovedbad på ca 12kvm. Ønsker mikrosement på vegger og innbygde armaturer."
            : "Want to renovate master bathroom approx 12 sqm. Prefer microcement walls and built-in faucets.",
          filesCount: 1,
          submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          status: "contacted",
        },
      ];
      localStorage.setItem("amiri_leads", JSON.stringify(defaultLeads));
      setLeads(defaultLeads);
    } else {
      setLeads(JSON.parse(savedLeads));
    }

    // Initial Seed Careers
    const savedApps = localStorage.getItem("amiri_applications");
    if (!savedApps) {
      const defaultApps = [
        {
          id: 1,
          name: "Morten Hansen",
          email: "morten.hansen@gmail.com",
          phone: "998 87 766",
          position: "Svenn / Faglært tømrer (Heltid)",
          experience: "8",
          message: lang === "no"
            ? "Hei! Jeg har fagbrev som tømrer og 8 års allsidig erfaring fra nybygg og rehabilitering. Har egen bil og verktøy."
            : "Hi! I hold a carpenter journeyman credentials and 8 years of versatile experience in framing and restoration.",
          fileName: "morten-hansen-cv.pdf",
          submittedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          status: "pending",
        },
      ];
      localStorage.setItem("amiri_applications", JSON.stringify(defaultApps));
      setApplications(defaultApps);
    } else {
      setApplications(JSON.parse(savedApps));
    }

    // Load User Submitted Reviews
    try {
      const savedReviews = localStorage.getItem("amiri_user_reviews_v1");
      if (savedReviews) {
        setUserReviews(JSON.parse(savedReviews));
      } else {
        setUserReviews([]);
      }
    } catch (err) {
      console.error("Failed to load reviews in admin panel", err);
    }

    // Load custom media assets
    const keys = [
      "amiri_custom_logo",
      "amiri_custom_hero",
      "amiri_custom_about",
      "amiri_custom_before",
      "amiri_custom_after",
      "amiri_custom_project_1",
      "amiri_custom_project_2",
      "amiri_custom_project_3",
      "amiri_custom_project_4",
      "amiri_custom_project_5",
      "amiri_custom_project_6",
    ];
    const loadedMedia: Record<string, string | null> = {};
    keys.forEach((k) => {
      try {
        loadedMedia[k] = localStorage.getItem(k);
      } catch {
        loadedMedia[k] = null;
      }
    });
    setMediaPreviews(loadedMedia);
  };

  useEffect(() => {
    loadData();
  }, [lang, refreshCounter]);

  // Auth Submit Handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = "AmiriBygg2026!";
    if (passcode.trim() === correctPass) {
      setIsAuthenticated(true);
      setAuthError("");
      try {
        sessionStorage.setItem("amiri_admin_authenticated", "true");
      } catch {}
    } else {
      setAuthError(
        lang === "no" 
          ? "Ugyldig passord. Prøv igjen." 
          : "Invalid passcode. Please try again."
      );
    }
  };

  // Sign out
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode("");
    try {
      sessionStorage.removeItem("amiri_admin_authenticated");
    } catch {}
  };

  // Status Modifiers
  const updateLeadStatus = (id: number, newStatus: string) => {
    const updated = leads.map((lead) => {
      if (lead.id === id) {
        return { ...lead, status: newStatus };
      }
      return lead;
    });
    localStorage.setItem("amiri_leads", JSON.stringify(updated));
    setLeads(updated);
  };

  const updateAppStatus = (id: number, newStatus: string) => {
    const updated = applications.map((app) => {
      if (app.id === id) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    localStorage.setItem("amiri_applications", JSON.stringify(updated));
    setApplications(updated);
  };

  const deleteLead = (id: number) => {
    const updated = leads.filter((l) => l.id !== id);
    localStorage.setItem("amiri_leads", JSON.stringify(updated));
    setLeads(updated);
  };

  const deleteApp = (id: number) => {
    const updated = applications.filter((a) => a.id !== id);
    localStorage.setItem("amiri_applications", JSON.stringify(updated));
    setApplications(updated);
  };

  const deleteUserReview = (indexToDelete: number) => {
    const updated = userReviews.filter((_, i) => i !== indexToDelete);
    localStorage.setItem("amiri_user_reviews_v1", JSON.stringify(updated));
    setUserReviews(updated);
    window.dispatchEvent(new Event("amiri_reviews_updated"));
    window.dispatchEvent(new Event("storage"));
  };

  // Media Upload Logic
  const handleMediaUpload = (key: string, file: File) => {
    setUploadLoading((prev) => ({ ...prev, [key]: true }));

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const base64 = reader.result as string;
        localStorage.setItem(key, base64);
        setMediaPreviews((prev) => ({ ...prev, [key]: base64 }));
        
        // Dispatch custom events to notify other components to re-render dynamically
        window.dispatchEvent(new Event("amiri_images_updated"));
        window.dispatchEvent(new Event("amiri_logo_updated"));
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        alert(
          lang === "no" 
            ? "Feil: Bildet er for stort. Prøv et mindre bilde (under 1.5MB) for optimal ytelse."
            : "Error: Image file is too large. Please use a smaller image (under 1.5MB) for fast local storage."
        );
      } finally {
        setUploadLoading((prev) => ({ ...prev, [key]: false }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Clear Custom Media
  const handleClearMedia = (key: string) => {
    try {
      localStorage.removeItem(key);
      setMediaPreviews((prev) => ({ ...prev, [key]: null }));
      window.dispatchEvent(new Event("amiri_images_updated"));
      window.dispatchEvent(new Event("amiri_logo_updated"));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
    }
  };

  // Locked Gate Screen
  if (!isAuthenticated) {
    return (
      <section id="admin-panel" className="py-24 bg-stone-900 text-white border-b border-stone-850">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-stone-950/80 border border-white/5 p-8 md:p-12 text-center relative shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-900 border border-white/10 rounded-full p-4 text-brand-taupe shadow-lg">
              <Lock className="w-6 h-6" />
            </div>

            <h2 className="text-2xl font-sans font-bold tracking-tight text-white mt-4 mb-2">
              {lang === "no" ? "Firmaområde (Låst)" : "Staff Portal (Restricted)"}
            </h2>
            <p className="text-stone-400 text-xs font-light leading-relaxed mb-8">
              {lang === "no" 
                ? "Dette panelet er beskyttet. Kun Amiri Bygg ansatte har rettigheter til å behandle henvendelser og endre bildemateriale."
                : "This system is locked. Only authorized Amiri Bygg technicians may review database leads and replace homepage media assets."}
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type={showPasscode ? "text" : "password"}
                  placeholder={lang === "no" ? "Skriv inn administratorpassord..." : "Enter admin credentials..."}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="flex-1 bg-stone-900 border border-white/10 py-3.5 px-4 text-sm font-mono text-white placeholder-stone-600 focus:outline-none focus:border-brand-taupe text-center"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="px-4 bg-stone-850 hover:bg-stone-800 border border-white/10 hover:border-white/20 text-stone-300 hover:text-white text-xs font-mono select-none flex items-center justify-center transition-all duration-200"
                >
                  {showPasscode ? (lang === "no" ? "SKJUL" : "HIDE") : (lang === "no" ? "VIS" : "SHOW")}
                </button>
              </div>

              {authError && (
                <p className="text-red-400 text-[11px] font-mono flex items-center justify-center gap-1.5 animate-bounce">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-taupe text-brand-charcoal font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-white transition-all duration-300"
              >
                <Unlock className="w-4 h-4" />
                <span>{lang === "no" ? "Lås opp systemet" : "Authenticate Access"}</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // Define assets that can be managed in Tab 2
  const customAssets = [
    {
      key: "amiri_custom_logo",
      title: lang === "no" ? "Hovedlogo (Header & Footer)" : "Primary Logo (Header & Footer)",
      desc: lang === "no" 
        ? "Erstatter standard SVG-merke med ditt eget opplastede bilde." 
        : "Replaces the built-in SVG vector badge with your exact corporate image.",
      ratio: "1:1",
      sizeHint: "Kvadratisk (t.eks. 512x512px) transparent PNG eller SVG",
      defaultUrl: "SVG Badge Fallback"
    },
    {
      key: "amiri_custom_hero",
      title: lang === "no" ? "Forsidebilde (Hero bakgrunn)" : "Hero Banner Background",
      desc: lang === "no" 
        ? "Det store bakgrunnsbildet helt øverst på nettsiden." 
        : "The prominent architectural background image at the top of the homepage.",
      ratio: "16:9",
      sizeHint: "Høy oppløsning (f.eks. 1920x1080px) JPG/PNG",
      defaultUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90"
    },
    {
      key: "amiri_custom_about",
      title: lang === "no" ? "Om Oss seksjonsbilde" : "About Us Narrative Image",
      desc: lang === "no" 
        ? "Bildet ved siden av historien om Amiri Bygg." 
        : "The architectural illustration alongside the Amiri Bygg story.",
      ratio: "4:5",
      sizeHint: "Stående bilde (f.eks. 800x1000px)",
      defaultUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
    },
    {
      key: "amiri_custom_before",
      title: lang === "no" ? "Før-bilde (Interaktiv slider)" : "Before Image (Interactive Slider)",
      desc: lang === "no" 
        ? "Vises på venstre side av den interaktive dra-og-slipp-sammenligningen." 
        : "Rendered on the left side of the interactive before/after split slider.",
      ratio: "16:9 / Landscape",
      sizeHint: "Landskap (f.eks. 1600x900px)",
      defaultUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1600&q=90"
    },
    {
      key: "amiri_custom_after",
      title: lang === "no" ? "Etter-bilde (Interaktiv slider)" : "After Image (Interactive Slider)",
      desc: lang === "no" 
        ? "Vises på høyre side av den interaktive sammenligningen." 
        : "Rendered on the right side of the interactive before/after split slider.",
      ratio: "16:9 / Landscape",
      sizeHint: "Landskap (f.eks. 1600x900px)",
      defaultUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90"
    }
  ];

  const portfolioProjects = [
    { id: 1, title: lang === "no" ? "Prosjekt 1: Villa Holmenkollen" : "Project 1: Villa Holmenkollen" },
    { id: 2, title: lang === "no" ? "Prosjekt 2: Kjøkkenoppgradering Nordstrand" : "Project 2: Kitchen Nordstrand" },
    { id: 3, title: lang === "no" ? "Prosjekt 3: Eksklusivt bad Frogner" : "Project 3: Bathroom Frogner" },
    { id: 4, title: lang === "no" ? "Prosjekt 4: Funkis tilbygg & terrasse" : "Project 4: Extension & Deck" },
    { id: 5, title: lang === "no" ? "Prosjekt 5: Fasade & etterisolering" : "Project 5: Facade & Insulation" },
    { id: 6, title: lang === "no" ? "Prosjekt 6: Klassisk totalrenovering" : "Project 6: Heritage Renovation" },
  ];

  return (
    <section id="admin-panel" className="py-24 bg-stone-900 text-white border-b border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Title */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-none mb-3 text-emerald-400 font-mono text-[10px] tracking-widest uppercase w-max">
              <Unlock className="w-3 h-3 text-emerald-400" />
              <span>{lang === "no" ? "ADMINISTRATOR MODUS AKTIV" : "ADMIN MODE AUTHENTICATED"}</span>
            </div>
            <h2 className="text-3xl font-sans font-semibold tracking-tight text-white">
              {lang === "no" ? "Kontrollpanel & Mediebibliotek" : "Control Panel & Media Library"}
            </h2>
            <p className="text-stone-400 text-sm font-light mt-1">
              {lang === "no" 
                ? "Sikker portal for ledelsen til å administrere forespørsler og endre alt av bilder på nettsiden."
                : "Secure dashboard for executives to analyze records and swap corporate marketing graphics."}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              id="refresh-admin-data"
              onClick={loadData}
              className="flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/20 transition-all py-2 px-4 text-xs font-mono tracking-widest uppercase"
              title="Refresh lists and reload images"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === "no" ? "Synkroniser" : "Sync"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="border border-red-500/35 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all py-2 px-4 text-xs font-mono tracking-widest uppercase"
            >
              {lang === "no" ? "Logg ut" : "Logout"}
            </button>
          </div>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex border-b border-white/5 mb-10 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("leads")}
            className={`py-3 px-6 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "leads" 
                ? "border-brand-taupe text-brand-taupe bg-white/[0.02]" 
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{lang === "no" ? "Kundehenvendelser & Jobber" : "Inbound leads & applicants"}</span>
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`py-3 px-6 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "media" 
                ? "border-brand-taupe text-brand-taupe bg-white/[0.02]" 
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Image className="w-4 h-4" />
            <span>{lang === "no" ? "🖼️ Bytt ut Bilder & Logo" : "🖼️ Customize Images & Logo"}</span>
          </button>
        </div>

        {/* TAB 1 CONTENT: LEADS, JOB APPLICATIONS & REVIEWS */}
        {activeTab === "leads" && (
          <div className="space-y-16 animate-fadeIn">
            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-white/[0.02] border border-white/5 border-t-2 border-t-stone-500 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                    {lang === "no" ? "Mottatte Forespørsler (Leads)" : "Total Quote Inquiries"}
                  </p>
                  <h4 className="text-2xl font-bold font-mono text-white">{leads.length}</h4>
                </div>
                <Folder className="w-6 h-6 text-stone-500" />
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 border-t-2 border-t-brand-taupe flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                    {lang === "no" ? "Ubehandlede Forespørsler" : "Pending Inquiries"}
                  </p>
                  <h4 className="text-2xl font-bold font-mono text-brand-taupe">
                    {leads.filter((l) => l.status === "pending" || l.status === "new").length}
                  </h4>
                </div>
                <Clock className="w-6 h-6 text-brand-taupe/70" />
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 border-t-2 border-t-emerald-500 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                    {lang === "no" ? "Jobbsøknader" : "Job Applicants"}
                  </p>
                  <h4 className="text-2xl font-bold font-mono text-emerald-500">{applications.length}</h4>
                </div>
                <Users className="w-6 h-6 text-emerald-500/70" />
              </div>
            </div>

            {/* LEADS PANEL */}
            <div>
              <h3 className="text-sm font-bold font-sans tracking-widest uppercase mb-4 border-b border-white/5 pb-2 text-stone-200">
                {lang === "no" ? "Kundehenvendelser (Gratis Befaring / Tilbud)" : "Client Leads (Free Inspections / Quotes)"}
              </h3>

              {leads.length === 0 ? (
                <div className="p-8 text-center text-stone-500 border border-white/5 font-mono text-xs">
                  {lang === "no" ? "Ingen kundehenvendelser lagret ennå." : "No leads received yet."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-stone-300 font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase text-stone-400 tracking-wider">
                        <th className="py-3 px-4">{lang === "no" ? "Dato" : "Date"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Kunde" : "Client"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Tjeneste" : "Service"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Budsjett" : "Budget"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Melding" : "Inquiry text"}</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">{lang === "no" ? "Handlinger" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-4 text-xs whitespace-nowrap text-stone-400">
                            {new Date(lead.submittedAt).toLocaleDateString(lang === "no" ? "no-NO" : "en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-white text-xs sm:text-sm">{lead.name}</p>
                            <p className="text-[11px] text-stone-400">{lead.phone}</p>
                            <p className="text-[11px] text-stone-400 truncate max-w-[150px]">{lead.email}</p>
                          </td>
                          <td className="py-4 px-4 text-xs font-semibold capitalize text-stone-200">
                            {lead.service}
                            {lead.filesCount > 0 && (
                              <span className="block text-[9px] text-brand-taupe mt-0.5">
                                📎 {lead.filesCount} {lang === "no" ? "vedlegg" : "files"}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs">
                            <span className="px-2 py-0.5 bg-white/5 text-stone-300 border border-white/10 uppercase">
                              {lead.budget || "Unspecified"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs max-w-xs font-light text-stone-400 line-clamp-2 mt-4 hover:line-clamp-none transition-all cursor-pointer">
                            {lead.message}
                          </td>
                          <td className="py-4 px-4 text-xs">
                            {lead.status === "new" || lead.status === "pending" ? (
                              <span className="inline-flex items-center gap-1.5 text-brand-taupe bg-brand-taupe/10 px-2 py-1 rounded-none border border-brand-taupe/20">
                                <Clock className="w-3 h-3" />
                                <span>{lang === "no" ? "Ubehandlet" : "Pending"}</span>
                              </span>
                            ) : lead.status === "contacted" ? (
                              <span className="inline-flex items-center gap-1.5 text-white bg-white/10 px-2 py-1 rounded-none border border-white/20">
                                <RefreshCw className="w-3 h-3" />
                                <span>{lang === "no" ? "Kontaktet" : "Contacted"}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-none border border-emerald-500/20">
                                <CheckCircle className="w-3 h-3" />
                                <span>{lang === "no" ? "Avtalt" : "Scheduled"}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => updateLeadStatus(lead.id, "contacted")}
                                className="text-[10px] uppercase font-bold border border-white/20 bg-white/5 hover:bg-white/20 py-1 px-2.5 text-white transition-colors"
                                title={lang === "no" ? "Marker som kontaktet" : "Mark Contacted"}
                              >
                                C
                              </button>
                              <button
                                onClick={() => updateLeadStatus(lead.id, "scheduled")}
                                className="text-[10px] uppercase font-bold border border-brand-taupe/20 bg-brand-taupe/5 hover:bg-brand-taupe/20 py-1 px-2.5 text-brand-taupe transition-colors"
                                title={lang === "no" ? "Marker som avtalt befaring" : "Schedule Inspection"}
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(lang === "no" ? "Slette denne henvendelsen?" : "Delete inquiry?")) {
                                    deleteLead(lead.id);
                                  }
                                }}
                                className="text-[10px] uppercase font-bold border border-red-500/25 bg-red-500/5 hover:bg-red-500/15 py-1 px-2 text-red-400 transition-colors"
                                title="Slett"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* CAREERS PANEL */}
            <div>
              <h3 className="text-sm font-bold font-sans tracking-widest uppercase mb-4 border-b border-white/5 pb-2 text-stone-200">
                {lang === "no" ? "Mottatte Jobbsøknader (Karriere)" : "Received Job Applications (Careers)"}
              </h3>

              {applications.length === 0 ? (
                <div className="p-8 text-center text-stone-500 border border-white/5 font-mono text-xs">
                  {lang === "no" ? "Ingen jobbsøknader mottatt ennå." : "No applications received yet."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-stone-300 font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase text-stone-400 tracking-wider">
                        <th className="py-3 px-4">{lang === "no" ? "Dato" : "Date"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Kandidat" : "Applicant"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Ønsket stilling" : "Position"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Erfaring" : "Experience"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Om kandidaten" : "Self-description"}</th>
                        <th className="py-3 px-4">CV</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">{lang === "no" ? "Handlinger" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-4 text-xs whitespace-nowrap text-stone-400">
                            {new Date(app.submittedAt).toLocaleDateString(lang === "no" ? "no-NO" : "en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-white text-xs sm:text-sm">{app.name}</p>
                            <p className="text-[11px] text-stone-400">{app.phone}</p>
                            <p className="text-[11px] text-stone-400">{app.email}</p>
                          </td>
                          <td className="py-4 px-4 text-xs font-semibold text-stone-200">
                            {app.position}
                          </td>
                          <td className="py-4 px-4 text-xs whitespace-nowrap">
                            {app.experience} {lang === "no" ? "år" : "years"}
                          </td>
                          <td className="py-4 px-4 text-xs max-w-xs font-light text-stone-400 line-clamp-2 mt-4 hover:line-clamp-none transition-all cursor-pointer">
                            {app.message}
                          </td>
                          <td className="py-4 px-4 text-xs whitespace-nowrap text-brand-taupe">
                            📄 {app.fileName || "resume.pdf"}
                          </td>
                          <td className="py-4 px-4 text-xs">
                            {app.status === "pending" || app.status === "new" ? (
                              <span className="inline-flex items-center gap-1.5 text-brand-taupe bg-brand-taupe/10 px-2 py-1 rounded-none border border-brand-taupe/20">
                                <Clock className="w-3 h-3" />
                                <span>{lang === "no" ? "Vurderes" : "In Review"}</span>
                              </span>
                            ) : app.status === "interview" ? (
                              <span className="inline-flex items-center gap-1.5 text-white bg-white/10 px-2 py-1 rounded-none border border-white/20">
                                <RefreshCw className="w-3 h-3" />
                                <span>{lang === "no" ? "Intervju" : "Interview"}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-none border border-emerald-500/20">
                                <CheckCircle className="w-3 h-3" />
                                <span>{lang === "no" ? "Ansatt" : "Hired"}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => updateAppStatus(app.id, "interview")}
                                className="text-[10px] uppercase font-bold border border-white/20 bg-white/5 hover:bg-white/20 py-1 px-2.5 text-white transition-colors"
                                title={lang === "no" ? "Innkall til intervju" : "Schedule Interview"}
                              >
                                I
                              </button>
                              <button
                                onClick={() => updateAppStatus(app.id, "hired")}
                                className="text-[10px] uppercase font-bold border border-brand-taupe/20 bg-brand-taupe/5 hover:bg-brand-taupe/20 py-1 px-2.5 text-brand-taupe transition-colors"
                                title={lang === "no" ? "Ansett" : "Hire Candidate"}
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(lang === "no" ? "Slette søknaden permanent?" : "Delete application?")) {
                                    deleteApp(app.id);
                                  }
                                }}
                                className="text-[10px] uppercase font-bold border border-red-500/25 bg-red-500/5 hover:bg-red-500/15 py-1 px-2 text-red-400 transition-colors"
                                title="Slett"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* REVIEWS MANAGER */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold font-sans tracking-widest uppercase text-stone-200 flex items-center gap-2">
                    <Star className="w-4 h-4 text-brand-taupe fill-brand-taupe" />
                    {lang === "no" ? "Håndtering av Brukeromtaler (Trollfilter)" : "Reviews & Testimonials Manager"}
                  </h3>
                  <p className="text-stone-400 text-xs font-light mt-0.5">
                    {lang === "no"
                      ? "Her kan du slette useriøse eller falske anmeldelser som er skrevet på nettsiden."
                      : "Review and delete unauthorized or spam reviews submitted on the website."}
                  </p>
                </div>
              </div>

              {userReviews.length === 0 ? (
                <div className="p-8 text-center text-stone-500 border border-white/5 bg-white/[0.01] font-mono text-xs">
                  {lang === "no" 
                    ? "Ingen brukerinnsendte omtaler registrert ennå. Siden er beskyttet." 
                    : "No user-submitted reviews in the database yet. Site is protected."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-stone-300 font-mono border-collapse border border-white/5 bg-white/[0.01]">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase text-stone-400 tracking-wider bg-white/5">
                        <th className="py-3 px-4">{lang === "no" ? "Forfatter" : "Author"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Sted / Prosjekt" : "Location / Project"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Vurdering" : "Rating"}</th>
                        <th className="py-3 px-4">{lang === "no" ? "Omtale tekst" : "Review Quote"}</th>
                        <th className="py-3 px-4 text-right">{lang === "no" ? "Håndtering" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {userReviews.map((rev, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4">
                            <p className="font-bold text-white text-xs sm:text-sm">{rev.author}</p>
                            <span className="text-[9px] bg-brand-taupe/10 text-brand-taupe border border-brand-taupe/20 px-1.5 py-0.5 uppercase tracking-wider font-bold">
                              {lang === "no" ? "Brukeromtale" : "User Review"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs">
                            <p className="text-stone-200 font-semibold">{rev.project}</p>
                            <p className="text-stone-400 text-[11px]">{rev.location}</p>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < (rev.rating || 5)
                                      ? "fill-brand-taupe text-brand-taupe"
                                      : "text-stone-800"
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs max-w-sm font-light text-stone-300 italic">
                            "{rev.quote}"
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(lang === "no" ? "Slette omtale?" : "Delete review?")) {
                                  deleteUserReview(idx);
                                }
                              }}
                              className="text-[10px] uppercase font-bold border border-red-500/25 bg-red-500/5 hover:bg-red-500/20 py-1 px-2.5 text-red-400 transition-all flex items-center gap-1 ml-auto cursor-pointer"
                              title="Delete review"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{lang === "no" ? "Slett" : "Delete"}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2 CONTENT: INTERACTIVE MEDIA AND LOGO CUSTOMIZER */}
        {activeTab === "media" && (
          <div className="space-y-12 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold font-sans tracking-widest uppercase text-stone-200 flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-taupe" />
                {lang === "no" ? "Nettstedbilder og Logotilpasning" : "Homepage Graphics & Logo Customizer"}
              </h3>
              <p className="text-stone-400 text-xs font-light mt-1 max-w-3xl leading-relaxed">
                {lang === "no"
                  ? "Last opp dine egne bilder for å endre utseendet på siden i sanntid. Bildene lagres sikkert i systemet. Hvis du sletter eller fjerner et bilde, vil nettsiden øyeblikkelig falle tilbake til standardbildet."
                  : "Upload custom image assets to tailor your digital showroom in real-time. Changes propagate instantly. Reset any slot to recover the high-quality Scandinavian default assets."}
              </p>
            </div>

            {/* Core Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {customAssets.map((asset) => {
                const currentPreview = mediaPreviews[asset.key];
                const isLoading = uploadLoading[asset.key];

                return (
                  <div 
                    key={asset.key} 
                    className="p-6 bg-stone-950/80 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors"
                  >
                    <div>
                      {/* Title & Badge */}
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
                          {asset.title}
                        </h4>
                        <span className="text-[8px] font-mono font-bold bg-stone-900 border border-white/10 px-2 py-0.5 text-stone-400 uppercase">
                          {asset.ratio}
                        </span>
                      </div>

                      <p className="text-stone-400 text-xs font-light mb-4 min-h-[32px] leading-relaxed">
                        {asset.desc}
                      </p>

                      {/* Visual Preview Box */}
                      <div className="relative aspect-video bg-stone-900/50 border border-white/5 flex items-center justify-center overflow-hidden mb-5">
                        {isLoading ? (
                          <div className="flex flex-col items-center gap-2 text-stone-500 font-mono text-xs">
                            <RefreshCw className="w-6 h-6 animate-spin text-brand-taupe" />
                            <span>Uploading...</span>
                          </div>
                        ) : currentPreview ? (
                          <img
                            src={currentPreview}
                            alt="Current preview"
                            className="w-full h-full object-contain p-2"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 text-stone-600 font-mono text-[10px] uppercase text-center px-4">
                            <FileImage className="w-8 h-8 text-stone-750" />
                            <span>{lang === "no" ? "Standard aktiv" : "Default active"}</span>
                            <span className="text-[8px] text-stone-700 font-sans tracking-normal select-none truncate max-w-xs block">
                              {asset.defaultUrl}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive Actions Panel */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5 mt-auto">
                      <label className="flex-1">
                        <span className="cursor-pointer flex items-center justify-center gap-2 border border-brand-taupe/40 bg-brand-taupe/10 hover:bg-brand-taupe hover:text-brand-charcoal text-brand-taupe text-[10px] font-mono tracking-widest uppercase py-2.5 transition-all text-center">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{lang === "no" ? "Velg fil" : "Choose Image"}</span>
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMediaUpload(asset.key, file);
                          }}
                        />
                      </label>

                      {currentPreview && (
                        <button
                          onClick={() => handleClearMedia(asset.key)}
                          className="flex-1 border border-stone-800 bg-stone-900 hover:bg-red-950/20 hover:border-red-500/20 text-stone-400 hover:text-red-400 text-[10px] font-mono tracking-widest uppercase py-2.5 transition-all"
                        >
                          {lang === "no" ? "Tilbakestill" : "Reset Default"}
                        </button>
                      )}
                    </div>
                    
                    <span className="block text-[8px] font-mono text-stone-600 mt-3 text-center">
                      {lang === "no" ? "Anbefalt: " : "Recommended: "}{asset.sizeHint}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Portfolio Grid Images Manager Accordion */}
            <div className="pt-10 border-t border-white/10 mt-12">
              <h4 className="text-sm font-bold font-sans tracking-widest uppercase text-stone-200 mb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-taupe" />
                {lang === "no" ? "Portefølje-prosjekter (6 Galleribilder)" : "Portfolio Projects (6 Grid Images)"}
              </h4>
              <p className="text-stone-400 text-xs font-light mb-8 max-w-2xl leading-relaxed">
                {lang === "no"
                  ? "Her kan du overstyre bildene i bildegalleriet for hvert av de 6 faste referanseprosjektene på nettsiden."
                  : "Swap out the grid thumbnails for each of the six reference construction projects showcased on the homepage."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioProjects.map((proj) => {
                  const storageKey = `amiri_custom_project_${proj.id}`;
                  const currentPreview = mediaPreviews[storageKey];
                  const isLoading = uploadLoading[storageKey];

                  return (
                    <div 
                      key={proj.id} 
                      className="p-5 bg-stone-950/40 border border-white/5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                          <span className="text-[11px] font-bold text-stone-200 font-mono uppercase truncate max-w-[180px]">
                            {proj.title}
                          </span>
                          <span className="text-[9px] font-mono bg-white/5 text-stone-400 px-1.5 py-0.5 uppercase">
                            ID: {proj.id}
                          </span>
                        </div>

                        {/* Box preview */}
                        <div className="relative aspect-video bg-stone-900 border border-white/5 flex items-center justify-center overflow-hidden mb-4">
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-brand-taupe" />
                          ) : currentPreview ? (
                            <img
                              src={currentPreview}
                              alt={`Project ${proj.id}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-[9px] font-mono text-stone-600 uppercase select-none">
                              {lang === "no" ? "Standard-bilde" : "Default Photo"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <label className="flex-1">
                          <span className="cursor-pointer flex items-center justify-center gap-1.5 border border-brand-taupe/20 bg-brand-taupe/5 hover:bg-brand-taupe/20 text-brand-taupe text-[9px] font-mono tracking-wider uppercase py-2 transition-all">
                            <Upload className="w-3 h-3" />
                            <span>{lang === "no" ? "Endre" : "Change"}</span>
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleMediaUpload(storageKey, file);
                            }}
                          />
                        </label>

                        {currentPreview && (
                          <button
                            onClick={() => handleClearMedia(storageKey)}
                            className="flex-1 border border-stone-800 bg-stone-900 hover:bg-red-950/20 hover:border-red-500/20 text-stone-500 hover:text-red-400 text-[9px] font-mono tracking-wider uppercase py-2 transition-all"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
