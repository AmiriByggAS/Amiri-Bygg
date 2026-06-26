import React, { useState, useEffect } from "react";
import { 
  Folder, Users, Star, Trash2, CheckCircle, Clock, ShieldAlert, 
  Database, RefreshCw, Upload, Image, Lock, Unlock, Settings, 
  HelpCircle, Eye, Sliders, Check, FileImage, Mail, Send, Sparkles, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationSchema } from "../translations";
import { 
  initAuth, 
  googleSignIn, 
  googleSignOut, 
  getAccessToken 
} from "../lib/auth";
import { 
  fetchInbox, 
  sendEmail, 
  trashMessage, 
  type GmailMessage 
} from "../lib/gmail";
import { saveGlobalMediaSetting } from "../lib/firebase";

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

  // Secure Lockout State & Persistent Timers
  const [failedAttempts, setFailedAttempts] = useState(() => {
    try {
      return Number(localStorage.getItem("amiri_admin_failed_attempts") || "0");
    } catch {
      return 0;
    }
  });
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  useEffect(() => {
    // Check if there is an active lockout in localStorage on app boot
    try {
      const lockoutUntil = Number(localStorage.getItem("amiri_admin_lockout_until") || "0");
      if (lockoutUntil > Date.now()) {
        const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
        setLockoutTimeLeft(remainingSeconds);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (lockoutTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setLockoutTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTimeLeft]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"leads" | "media" | "services" | "gmail">("leads");

  // Custom Content Editors
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<number | null>(null);

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    fullDetails: "",
    badge: "",
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    location: "",
    size: "",
    duration: "",
    completionYear: "",
  });

  // Core Data
  const [leads, setLeads] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);

  // Google Auth & Gmail State
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[]>([]);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [gmailError, setGmailError] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const loadGmailInbox = async (token: string) => {
    setGmailLoading(true);
    setGmailError("");
    try {
      const msgs = await fetchInbox(token);
      setGmailMessages(msgs);
    } catch (err: any) {
      console.error(err);
      setGmailError(lang === "no" ? "Klarte ikke å hente e-poster. Vennligst sjekk påloggingen." : "Failed to load emails. Please check your login.");
    } finally {
      setGmailLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        if (activeTab === "gmail") {
          loadGmailInbox(token);
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "gmail" && googleToken) {
      loadGmailInbox(googleToken);
    }
  }, [activeTab]);

  const handleGoogleLogin = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        loadGmailInbox(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleGoogleLogout = async () => {
    await googleSignOut();
    setGoogleUser(null);
    setGoogleToken(null);
    setGmailMessages([]);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleToken || !replyTo || !replySubject || !replyBody) return;

    // Explicit confirmation dialog for sending email (mutates state/sends data - MANDATORY)
    const confirmed = window.confirm(
      lang === "no" 
        ? `Er du sikker på at du vil sende denne e-posten til ${replyTo}?` 
        : `Are you sure you want to send this email to ${replyTo}?`
    );
    if (!confirmed) return;

    setIsSending(true);
    try {
      const htmlBody = replyBody.replace(/\n/g, "<br />");
      await sendEmail(googleToken, replyTo, replySubject, htmlBody);
      alert(lang === "no" ? "E-post ble sendt!" : "Email sent successfully!");
      setShowReplyModal(false);
      setReplyTo("");
      setReplySubject("");
      setReplyBody("");
    } catch (err: any) {
      console.error(err);
      alert(lang === "no" ? "Feil under sending av e-post." : "Error sending email.");
    } finally {
      setIsSending(false);
    }
  };

  const handleTrashMessage = async (msgId: string) => {
    if (!googleToken) return;

    // Explicit confirmation dialog for deletion (destructive - MANDATORY)
    const confirmed = window.confirm(
      lang === "no"
        ? "Er du sikker på at du vil slette denne e-posten? Den vil bli flyttet til papirkurven."
        : "Are you sure you want to delete this email? It will be moved to the trash."
    );
    if (!confirmed) return;

    try {
      await trashMessage(googleToken, msgId);
      setGmailMessages(prev => prev.filter(m => m.id !== msgId));
    } catch (err: any) {
      console.error(err);
      alert(lang === "no" ? "Feil under sletting av e-post." : "Error deleting email.");
    }
  };

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
      ...Object.keys(t.services.items).map(k => `amiri_custom_service_${k}_image`)
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

    // Check if currently locked out
    const lockoutUntil = Number(localStorage.getItem("amiri_admin_lockout_until") || "0");
    if (lockoutUntil > Date.now()) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setLockoutTimeLeft(remainingSeconds);
      setAuthError(
        lang === "no" 
          ? `Sikkerhetsblokkering aktiv. Vennligst vent ${remainingSeconds} sekunder.`
          : `Security lockout active. Please wait ${remainingSeconds} seconds.`
      );
      return;
    }

    const correctPass = "AmiriByggAS2026!";
    if (passcode.trim() === correctPass) {
      setIsAuthenticated(true);
      setAuthError("");
      setFailedAttempts(0);
      try {
        localStorage.removeItem("amiri_admin_failed_attempts");
        localStorage.removeItem("amiri_admin_lockout_until");
        sessionStorage.setItem("amiri_admin_authenticated", "true");
      } catch {}
    } else {
      const newFailed = failedAttempts + 1;
      setFailedAttempts(newFailed);
      try {
        localStorage.setItem("amiri_admin_failed_attempts", String(newFailed));
      } catch {}

      if (newFailed >= 3) {
        // Progressive lockout: 30s, 60s, 120s, 240s...
        const durationSec = 30 * Math.pow(2, Math.max(0, newFailed - 3));
        const unlockTime = Date.now() + durationSec * 1000;
        try {
          localStorage.setItem("amiri_admin_lockout_until", String(unlockTime));
        } catch {}
        setLockoutTimeLeft(durationSec);
        setAuthError(
          lang === "no" 
            ? `For mange mislykkede forsøk. Systemet er låst i ${durationSec} sekunder.`
            : `Too many failed attempts. System locked for ${durationSec} seconds.`
        );
      } else {
        const remaining = 3 - newFailed;
        setAuthError(
          lang === "no" 
            ? `Feil passord! Vennligst prøv igjen. Du har ${remaining} forsøk igjen før midlertidig blokkering.` 
            : `Incorrect passcode! Please try again. You have ${remaining} attempts remaining before temporary lockout.`
        );
      }
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

  // Compress image on the client side to keep localStorage quota happy and Firestore fast
  const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Downscale only if image exceeds our max dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string); // fallback to original
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Use JPEG format for smaller file sizes, except for PNG/SVGs
          const isPng = file.type === "image/png" || file.type === "image/svg+xml";
          const mimeType = isPng ? "image/png" : "image/jpeg";
          const dataUrl = canvas.toDataURL(mimeType, quality);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Media Upload Logic
  const handleMediaUpload = async (key: string, file: File) => {
    setUploadLoading((prev) => ({ ...prev, [key]: true }));
    try {
      // 1. Compress image to fit 1.5MB localstorage & Firestore rules instantly
      const base64 = await compressImage(file, 1200, 1200, 0.8);
      
      // 2. Save locally
      localStorage.setItem(key, base64);
      setMediaPreviews((prev) => ({ ...prev, [key]: base64 }));
      
      // Dispatch custom events to notify other components to re-render dynamically
      window.dispatchEvent(new Event("amiri_images_updated"));
      window.dispatchEvent(new Event("amiri_logo_updated"));
      window.dispatchEvent(new Event("amiri_services_updated"));
      window.dispatchEvent(new Event("amiri_projects_updated"));
      window.dispatchEvent(new Event("storage"));

      // 3. Sync to Firestore global database
      await saveGlobalMediaSetting(key, base64);
    } catch (err) {
      console.error("Failed to compress or upload image:", err);
      alert(
        lang === "no" 
          ? "Feil under opplasting eller komprimering av bilde. Prøv et annet bilde."
          : "Error uploading or compressing image. Please try another image."
      );
    } finally {
      setUploadLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Clear Custom Media
  const handleClearMedia = async (key: string) => {
    try {
      localStorage.removeItem(key);
      setMediaPreviews((prev) => ({ ...prev, [key]: null }));
      window.dispatchEvent(new Event("amiri_images_updated"));
      window.dispatchEvent(new Event("amiri_logo_updated"));
      window.dispatchEvent(new Event("amiri_services_updated"));
      window.dispatchEvent(new Event("amiri_projects_updated"));
      window.dispatchEvent(new Event("storage"));

      // Sync removal to Firestore global database
      await saveGlobalMediaSetting(key, null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveService = async (key: string) => {
    try {
      localStorage.setItem(`amiri_custom_service_${key}_title`, serviceForm.title);
      localStorage.setItem(`amiri_custom_service_${key}_description`, serviceForm.description);
      localStorage.setItem(`amiri_custom_service_${key}_fullDetails`, serviceForm.fullDetails);
      localStorage.setItem(`amiri_custom_service_${key}_badge`, serviceForm.badge);

      await saveGlobalMediaSetting(`amiri_custom_service_${key}_title`, serviceForm.title || "");
      await saveGlobalMediaSetting(`amiri_custom_service_${key}_description`, serviceForm.description || "");
      await saveGlobalMediaSetting(`amiri_custom_service_${key}_fullDetails`, serviceForm.fullDetails || "");
      await saveGlobalMediaSetting(`amiri_custom_service_${key}_badge`, serviceForm.badge || "");

      window.dispatchEvent(new Event("amiri_services_updated"));
      window.dispatchEvent(new Event("storage"));

      setEditingService(null);
      alert(lang === "no" ? "Endringer lagret globalt for tjenesten!" : "Service edits saved globally!");
    } catch (err) {
      console.error(err);
      alert("Error saving service content.");
    }
  };

  const handleResetService = async (key: string) => {
    if (!window.confirm(lang === "no" ? "Vil du fjerne alle tilpasninger for denne tjenesten og gå tilbake til standard?" : "Reset all modifications on this service to system default?")) return;
    try {
      localStorage.removeItem(`amiri_custom_service_${key}_title`);
      localStorage.removeItem(`amiri_custom_service_${key}_description`);
      localStorage.removeItem(`amiri_custom_service_${key}_fullDetails`);
      localStorage.removeItem(`amiri_custom_service_${key}_badge`);
      localStorage.removeItem(`amiri_custom_service_${key}_image`);

      await saveGlobalMediaSetting(`amiri_custom_service_${key}_title`, null);
      await saveGlobalMediaSetting(`amiri_custom_service_${key}_description`, null);
      await saveGlobalMediaSetting(`amiri_custom_service_${key}_fullDetails`, null);
      await saveGlobalMediaSetting(`amiri_custom_service_${key}_badge`, null);
      await saveGlobalMediaSetting(`amiri_custom_service_${key}_image`, null);

      setMediaPreviews(prev => ({ ...prev, [`amiri_custom_service_${key}_image`]: null }));

      window.dispatchEvent(new Event("amiri_services_updated"));
      window.dispatchEvent(new Event("storage"));

      setEditingService(null);
      alert(lang === "no" ? "Tjenesten ble tilbakestilt til standard!" : "Service restored to defaults!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProject = async (id: number) => {
    try {
      localStorage.setItem(`amiri_custom_project_${id}_title`, projectForm.title);
      localStorage.setItem(`amiri_custom_project_${id}_location`, projectForm.location);
      localStorage.setItem(`amiri_custom_project_${id}_size`, projectForm.size);
      localStorage.setItem(`amiri_custom_project_${id}_duration`, projectForm.duration);
      localStorage.setItem(`amiri_custom_project_${id}_completion`, projectForm.completionYear);

      await saveGlobalMediaSetting(`amiri_custom_project_${id}_title`, projectForm.title || "");
      await saveGlobalMediaSetting(`amiri_custom_project_${id}_location`, projectForm.location || "");
      await saveGlobalMediaSetting(`amiri_custom_project_${id}_size`, projectForm.size || "");
      await saveGlobalMediaSetting(`amiri_custom_project_${id}_duration`, projectForm.duration || "");
      await saveGlobalMediaSetting(`amiri_custom_project_${id}_completion`, projectForm.completionYear || "");

      window.dispatchEvent(new Event("amiri_projects_updated"));
      window.dispatchEvent(new Event("storage"));

      setEditingProject(null);
      alert(lang === "no" ? "Prosjektets detaljer ble lagret globalt!" : "Project details saved globally!");
    } catch (err) {
      console.error(err);
      alert("Error saving project content.");
    }
  };

  const handleResetProjectText = async (id: number) => {
    if (!window.confirm(lang === "no" ? "Sikker på at du vil tilbakestille tekstene for dette prosjektet?" : "Reset text fields on this project to defaults?")) return;
    try {
      localStorage.removeItem(`amiri_custom_project_${id}_title`);
      localStorage.removeItem(`amiri_custom_project_${id}_location`);
      localStorage.removeItem(`amiri_custom_project_${id}_size`);
      localStorage.removeItem(`amiri_custom_project_${id}_duration`);
      localStorage.removeItem(`amiri_custom_project_${id}_completion`);

      await saveGlobalMediaSetting(`amiri_custom_project_${id}_title`, null);
      await saveGlobalMediaSetting(`amiri_custom_project_${id}_location`, null);
      await saveGlobalMediaSetting(`amiri_custom_project_${id}_size`, null);
      await saveGlobalMediaSetting(`amiri_custom_project_${id}_duration`, null);
      await saveGlobalMediaSetting(`amiri_custom_project_${id}_completion`, null);

      window.dispatchEvent(new Event("amiri_projects_updated"));
      window.dispatchEvent(new Event("storage"));

      setEditingProject(null);
      alert(lang === "no" ? "Prosjekttekstene ble tilbakestilt til standard!" : "Project texts restored to defaults!");
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

            {lockoutTimeLeft > 0 ? (
              <div className="space-y-4 p-6 bg-red-950/20 border border-red-500/25">
                <div className="flex justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-14 h-14 rounded-full bg-red-950/50 border border-red-500/50 flex items-center justify-center text-red-400 animate-pulse"
                  >
                    <ShieldAlert className="w-8 h-8" />
                  </motion.div>
                </div>
                <h3 className="font-mono text-sm uppercase text-red-400 tracking-wider font-semibold">
                  {lang === "no" ? "Sikkerhetslås Aktiv" : "Security Lockout Active"}
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed max-w-sm mx-auto">
                  {lang === "no"
                    ? `Systemet har midlertidig stengt tilgangen pga. gjentatte feilaktige forsøk. Prøv igjen om:`
                    : `Access is temporarily frozen due to multiple failed password attempts. Retry in:`}
                </p>
                <div className="text-3xl font-mono text-red-500 font-bold tracking-widest animate-pulse">
                  {lockoutTimeLeft}s
                </div>
              </div>
            ) : (
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
            )}
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
          <button
            onClick={() => setActiveTab("services")}
            className={`py-3 px-6 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "services" 
                ? "border-brand-taupe text-brand-taupe bg-white/[0.02]" 
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{lang === "no" ? "✏️ Tjenester & Innhold" : "✏️ Services & Content"}</span>
          </button>
          <button
            onClick={() => setActiveTab("gmail")}
            className={`py-3 px-6 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "gmail" 
                ? "border-brand-taupe text-brand-taupe bg-white/[0.02]" 
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{lang === "no" ? "📧 Gmail Innboks" : "📧 Gmail Inbox"}</span>
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
                                onClick={async () => {
                                  let currentToken = googleToken;
                                  if (!currentToken) {
                                    const alertRes = window.confirm(lang === "no" 
                                      ? "Du må koble til din Google-konto for å sende e-post med Gmail. Vil du logge på nå?" 
                                      : "You must connect your Google account to send emails via Gmail. Do you want to sign in now?");
                                    if (!alertRes) return;
                                    try {
                                      const res = await googleSignIn();
                                      if (res) {
                                        currentToken = res.accessToken;
                                        setGoogleUser(res.user);
                                        setGoogleToken(res.accessToken);
                                      }
                                    } catch (err) {
                                      return;
                                    }
                                  }
                                  setReplyTo(lead.email);
                                  setReplySubject(lang === "no" 
                                    ? `Angående din henvendelse til Amiri Bygg AS - ${lead.service}` 
                                    : `Regarding your inquiry to Amiri Bygg AS - ${lead.service}`);
                                  setReplyBody(lang === "no"
                                    ? `Hei ${lead.name},\n\nTakk for din henvendelse til Amiri Bygg AS angående ${lead.service}.\n\nVi har vurdert din henvendelse og vil gjerne avtale et tidspunkt for befaring.\n\nMed vennlig hilsen,\nAmiri Bygg AS\ninfo@amiribygg.no`
                                    : `Hi ${lead.name},\n\nThank you for reaching out to Amiri Bygg AS regarding ${lead.service}.\n\nWe have reviewed your request and would love to schedule a free inspection.\n\nBest regards,\nAmiri Bygg AS\ninfo@amiribygg.no`);
                                  setShowReplyModal(true);
                                }}
                                className="text-[10px] uppercase font-bold border border-brand-taupe bg-brand-taupe/15 hover:bg-brand-taupe hover:text-brand-charcoal py-1 px-2.5 text-brand-taupe transition-all flex items-center gap-1.5"
                                title={lang === "no" ? "Svar med Gmail" : "Reply with Gmail"}
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span className="hidden xl:inline">{lang === "no" ? "E-post" : "Email"}</span>
                              </button>
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
                                onClick={async () => {
                                  let currentToken = googleToken;
                                  if (!currentToken) {
                                    const alertRes = window.confirm(lang === "no" 
                                      ? "Du må koble til din Google-konto for å sende e-post med Gmail. Vil du logge på nå?" 
                                      : "You must connect your Google account to send emails via Gmail. Do you want to sign in now?");
                                    if (!alertRes) return;
                                    try {
                                      const res = await googleSignIn();
                                      if (res) {
                                        currentToken = res.accessToken;
                                        setGoogleUser(res.user);
                                        setGoogleToken(res.accessToken);
                                      }
                                    } catch (err) {
                                      return;
                                    }
                                  }
                                  setReplyTo(app.email);
                                  setReplySubject(lang === "no" 
                                    ? `Angående din søknad hos Amiri Bygg AS - ${app.position}` 
                                    : `Regarding your application at Amiri Bygg AS - ${app.position}`);
                                  setReplyBody(lang === "no"
                                    ? `Hei ${app.name},\n\nTakk for din søknad på stillingen som ${app.position} hos Amiri Bygg AS.\n\nVi har sett over din profil og erfaring, og ønsker gjerne å invitere deg til et intervju.\n\nMed vennlig hilsen,\nAmiri Bygg AS\ninfo@amiribygg.no`
                                    : `Hi ${app.name},\n\nThank you for your application for the ${app.position} position at Amiri Bygg AS.\n\nWe have reviewed your profile and experience, and would love to invite you for an interview.\n\nBest regards,\nAmiri Bygg AS\ninfo@amiribygg.no`);
                                  setShowReplyModal(true);
                                }}
                                className="text-[10px] uppercase font-bold border border-brand-taupe bg-brand-taupe/15 hover:bg-brand-taupe hover:text-brand-charcoal py-1 px-2.5 text-brand-taupe transition-all flex items-center gap-1.5"
                                title={lang === "no" ? "Svar med Gmail" : "Reply with Gmail"}
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span className="hidden xl:inline">{lang === "no" ? "E-post" : "Email"}</span>
                              </button>
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

        {/* TAB 2.5 CONTENT: SERVICES AND CONTENT CUSTOMIZER */}
        {activeTab === "services" && (
          <div className="space-y-12 animate-fadeIn text-left">
            <div>
              <h3 className="text-base font-bold font-sans tracking-widest uppercase text-stone-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-taupe" />
                {lang === "no" ? "Tjenester & Innholdsredigering" : "Services & Content Customizer"}
              </h3>
              <p className="text-stone-400 text-xs font-light mt-1 max-w-3xl leading-relaxed">
                {lang === "no"
                  ? "Her kan du tilpasse både teksten og bildene for alle de 15 tjenestene og de 6 referanseprosjektene dine. Alle endringer lagres globalt og oppdateres for alle besøkende."
                  : "Customize both the text narrative and associated images for your 15 core services and 6 portfolio projects. Edits persist globally."}
              </p>
            </div>

            {/* SEKTION 1: VÅRE TJENESTER */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold font-sans tracking-widest uppercase text-brand-taupe border-b border-white/5 pb-2">
                {lang === "no" ? "1. Tilpass Våre Tjenester" : "1. Customize Our Services"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(t.services.items).map(([key, service]) => {
                  const isEditing = editingService === key;
                  
                  // Retrieve current custom values (fallback to default translation fields)
                  const currentTitle = localStorage.getItem(`amiri_custom_service_${key}_title`) || service.title;
                  const currentDesc = localStorage.getItem(`amiri_custom_service_${key}_description`) || service.description;
                  const currentFull = localStorage.getItem(`amiri_custom_service_${key}_fullDetails`) || service.fullDetails;
                  const currentBadge = localStorage.getItem(`amiri_custom_service_${key}_badge`) || service.badge;
                  const currentImg = mediaPreviews[`amiri_custom_service_${key}_image` || ""];
                  const isImgLoading = uploadLoading[`amiri_custom_service_${key}_image` || ""];

                  return (
                    <div 
                      key={key} 
                      className="p-6 bg-stone-950/60 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors"
                    >
                      {isEditing ? (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                            <span className="text-[10px] font-mono text-brand-taupe uppercase tracking-widest font-bold">
                              {lang === "no" ? `Redigerer: ${key}` : `Editing: ${key}`}
                            </span>
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                              {lang === "no" ? "Tittel" : "Title"}
                            </label>
                            <input
                              type="text"
                              value={serviceForm.title}
                              onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full bg-stone-900 border border-white/10 focus:border-brand-taupe text-xs text-white py-2 px-3 rounded-none outline-none font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                              {lang === "no" ? "Kort Beskrivelse" : "Short Description"}
                            </label>
                            <input
                              type="text"
                              value={serviceForm.description}
                              onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full bg-stone-900 border border-white/10 focus:border-brand-taupe text-xs text-white py-2 px-3 rounded-none outline-none font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                              {lang === "no" ? "Detaljert Beskrivelse (Befaringsdetaljer)" : "Detailed Narrative (Full Details)"}
                            </label>
                            <textarea
                              rows={4}
                              value={serviceForm.fullDetails}
                              onChange={(e) => setServiceForm(prev => ({ ...prev, fullDetails: e.target.value }))}
                              className="w-full bg-stone-900 border border-white/10 focus:border-brand-taupe text-xs text-white p-3 rounded-none outline-none font-sans leading-relaxed resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                                {lang === "no" ? "Skilt / Badge" : "Badge Tag"}
                              </label>
                              <input
                                type="text"
                                value={serviceForm.badge}
                                placeholder="t.eks. Garanti"
                                onChange={(e) => setServiceForm(prev => ({ ...prev, badge: e.target.value }))}
                                className="w-full bg-stone-900 border border-white/10 focus:border-brand-taupe text-xs text-white py-2 px-3 rounded-none outline-none font-sans"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                                {lang === "no" ? "Tjenestebilde" : "Service Photo"}
                              </label>
                              <label className="block">
                                <span className="cursor-pointer flex items-center justify-center gap-1.5 border border-brand-taupe/20 bg-brand-taupe/5 hover:bg-brand-taupe/20 text-brand-taupe text-[10px] font-mono tracking-wider uppercase py-2 transition-all text-center">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>{lang === "no" ? "Velg bilde" : "Upload File"}</span>
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleMediaUpload(`amiri_custom_service_${key}_image`, file);
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Image preview box in form */}
                          <div className="aspect-[21/9] relative bg-stone-900 border border-white/5 flex items-center justify-center overflow-hidden">
                            {isImgLoading ? (
                              <RefreshCw className="w-4 h-4 animate-spin text-brand-taupe" />
                            ) : currentImg ? (
                              <img
                                src={currentImg}
                                alt="Service custom"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-[10px] font-mono text-stone-600 uppercase">
                                {lang === "no" ? "Ikke eget bilde (Kun ikon)" : "No custom image (Uses icon)"}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleSaveService(key)}
                              className="flex-1 bg-brand-taupe hover:bg-white text-brand-charcoal font-bold text-[10px] font-mono tracking-widest uppercase py-2 transition-all cursor-pointer"
                            >
                              {lang === "no" ? "Lagre globalt" : "Save Global"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingService(null)}
                              className="flex-1 border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-400 text-[10px] font-mono tracking-widest uppercase py-2 transition-all"
                            >
                              {lang === "no" ? "Avbryt" : "Cancel"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResetService(key)}
                              className="border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 text-red-400 px-3 transition-all text-[10px] font-mono tracking-widest uppercase cursor-pointer"
                              title="Reset"
                            >
                              {lang === "no" ? "Nullstill" : "Reset"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-between h-full">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                              <h5 className="text-xs font-bold text-stone-200 uppercase tracking-wider font-sans">
                                {currentTitle}
                              </h5>
                              {currentBadge && (
                                <span className="text-[8px] bg-brand-taupe/10 text-brand-taupe border border-brand-taupe/20 px-1.5 py-0.5 uppercase tracking-wider font-bold">
                                  {currentBadge}
                                </span>
                              )}
                            </div>

                            <p className="text-stone-400 text-xs font-light min-h-[36px] leading-relaxed">
                              {currentDesc}
                            </p>

                            <p className="text-stone-500 text-[11px] font-light line-clamp-2 italic leading-relaxed">
                              "{currentFull}"
                            </p>

                            <div className="aspect-[21/9] relative bg-stone-900 border border-white/5 flex items-center justify-center overflow-hidden">
                              {currentImg ? (
                                <img
                                  src={currentImg}
                                  alt="Service custom Preview"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span className="text-[9px] font-mono text-stone-600 uppercase tracking-widest">
                                  {lang === "no" ? "Eget bilde ikke aktivt" : "No custom photo uploaded"}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingService(key);
                                setServiceForm({
                                  title: currentTitle,
                                  description: currentDesc,
                                  fullDetails: currentFull,
                                  badge: currentBadge,
                                });
                              }}
                              className="flex-1 bg-stone-900 hover:bg-brand-taupe/20 border border-white/5 hover:border-brand-taupe/20 text-stone-300 hover:text-brand-taupe text-[10px] font-mono tracking-widest uppercase py-2 transition-all cursor-pointer"
                            >
                              {lang === "no" ? "✏️ Rediger" : "✏️ Edit Content"}
                            </button>
                            {currentImg && (
                              <button
                                type="button"
                                onClick={() => handleClearMedia(`amiri_custom_service_${key}_image`)}
                                className="border border-stone-800 hover:bg-red-950/20 text-stone-500 hover:text-red-400 text-[10px] font-mono px-3 transition-all uppercase tracking-wider cursor-pointer"
                                title="Reset Image Only"
                              >
                                {lang === "no" ? "Fjern bilde" : "Clear Photo"}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEKTION 2: REFERANSEPROSJEKTER TEKSTER */}
            <div className="space-y-6 pt-10 border-t border-white/10 mt-12">
              <h4 className="text-sm font-bold font-sans tracking-widest uppercase text-brand-taupe border-b border-white/5 pb-2">
                {lang === "no" ? "2. Tilpass Prosjekttekster (Gallerikort)" : "2. Customize Project Narratives (Gallery Cards)"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 1, defaultTitle: "Villa Holmenkollen", defaultCat: "renovation", defaultLoc: "Oslo", defaultSize: "240 m²", defaultDur: lang === "no" ? "5 måneder" : "5 months", defaultComp: "2025" },
                  { id: 2, defaultTitle: lang === "no" ? "Kjøkkenoppgradering Nordstrand" : "Modern Kitchen Nordstrand", defaultCat: "kitchen-bath", defaultLoc: "Nordstrand, Oslo", defaultSize: "28 m²", defaultDur: lang === "no" ? "4 uker" : "4 weeks", defaultComp: "2026" },
                  { id: 3, defaultTitle: lang === "no" ? "Eksklusivt bad Frogner" : "Luxury Bathroom Frogner", defaultCat: "kitchen-bath", defaultLoc: "Frogner, Oslo", defaultSize: "16 m²", defaultDur: lang === "no" ? "3 uker" : "3 weeks", defaultComp: "2025" },
                  { id: 4, defaultTitle: lang === "no" ? "Funkis tilbygg & terrasse" : "Modern Extension & Deck", defaultCat: "exterior", defaultLoc: "Asker", defaultSize: "45 m²", defaultDur: lang === "no" ? "8 uker" : "8 weeks", defaultComp: "2025" },
                  { id: 5, defaultTitle: lang === "no" ? "Fasade & etterisolering" : "Facade & Retro-Insulation", defaultCat: "exterior", defaultLoc: "Bærum", defaultSize: "185 m²", defaultDur: lang === "no" ? "6 uker" : "6 weeks", defaultComp: "2026" },
                  { id: 6, defaultTitle: lang === "no" ? "Klassisk totalrenovering bygård" : "Heritage Apartment Renovation", defaultCat: "renovation", defaultLoc: "Majorstuen, Oslo", defaultSize: "115 m²", defaultDur: lang === "no" ? "12 uker" : "12 weeks", defaultComp: "2025" },
                ].map((proj) => {
                  const isEditing = editingProject === proj.id;
                  
                  // Load current custom or defaults
                  const currentTitle = localStorage.getItem(`amiri_custom_project_${proj.id}_title`) || proj.defaultTitle;
                  const currentLoc = localStorage.getItem(`amiri_custom_project_${proj.id}_location`) || proj.defaultLoc;
                  const currentSize = localStorage.getItem(`amiri_custom_project_${proj.id}_size`) || proj.defaultSize;
                  const currentDur = localStorage.getItem(`amiri_custom_project_${proj.id}_duration`) || proj.defaultDur;
                  const currentComp = localStorage.getItem(`amiri_custom_project_${proj.id}_completion`) || proj.defaultComp;

                  return (
                    <div 
                      key={proj.id} 
                      className="p-6 bg-stone-950/60 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors"
                    >
                      {isEditing ? (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                            <span className="text-[10px] font-mono text-brand-taupe uppercase tracking-widest font-bold">
                              {lang === "no" ? `Redigerer Prosjekt #${proj.id}` : `Editing Project #${proj.id}`}
                            </span>
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                              {lang === "no" ? "Prosjektnavn / Tittel" : "Project Title"}
                            </label>
                            <input
                              type="text"
                              value={projectForm.title}
                              onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full bg-stone-900 border border-white/10 focus:border-brand-taupe text-xs text-white py-2 px-3 rounded-none outline-none font-sans"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                                {lang === "no" ? "Sted" : "Location"}
                              </label>
                              <input
                                type="text"
                                value={projectForm.location}
                                onChange={(e) => setProjectForm(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full bg-stone-900 border border-white/10 focus:border-brand-taupe text-xs text-white py-2 px-3 rounded-none outline-none font-sans"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                                {lang === "no" ? "Størrelse (f.eks. 120 m²)" : "Size"}
                              </label>
                              <input
                                type="text"
                                value={projectForm.size}
                                onChange={(e) => setProjectForm(prev => ({ ...prev, size: e.target.value }))}
                                className="w-full bg-stone-900 border border-white/10 focus:border-brand-taupe text-xs text-white py-2 px-3 rounded-none outline-none font-sans"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                                {lang === "no" ? "Varighet" : "Duration"}
                              </label>
                              <input
                                type="text"
                                value={projectForm.duration}
                                onChange={(e) => setProjectForm(prev => ({ ...prev, duration: e.target.value }))}
                                className="w-full bg-stone-900 border border-white/10 focus:border-brand-taupe text-xs text-white py-2 px-3 rounded-none outline-none font-sans"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                                {lang === "no" ? "Fullføringsår" : "Completion Year"}
                              </label>
                              <input
                                type="text"
                                value={projectForm.completionYear}
                                onChange={(e) => setProjectForm(prev => ({ ...prev, completionYear: e.target.value }))}
                                className="w-full bg-stone-900 border border-white/10 focus:border-brand-taupe text-xs text-white py-2 px-3 rounded-none outline-none font-sans"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleSaveProject(proj.id)}
                              className="flex-1 bg-brand-taupe hover:bg-white text-brand-charcoal font-bold text-[10px] font-mono tracking-widest uppercase py-2 transition-all cursor-pointer"
                            >
                              {lang === "no" ? "Lagre globalt" : "Save Global"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProject(null)}
                              className="flex-1 border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-400 text-[10px] font-mono tracking-widest uppercase py-2 transition-all"
                            >
                              {lang === "no" ? "Avbryt" : "Cancel"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResetProjectText(proj.id)}
                              className="border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 text-red-400 px-3 transition-all text-[10px] font-mono tracking-widest uppercase cursor-pointer"
                              title="Reset"
                            >
                              {lang === "no" ? "Nullstill" : "Reset"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-between h-full space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <h5 className="text-xs font-bold text-stone-200 uppercase tracking-wider font-sans">
                                {currentTitle}
                              </h5>
                              <span className="text-[9px] font-mono bg-white/5 text-stone-400 px-1.5 py-0.5 uppercase">
                                ID: {proj.id}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-light">
                              <div>
                                <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 block">Sted:</span>
                                <span className="text-stone-300">{currentLoc}</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 block">Størrelse:</span>
                                <span className="text-stone-300">{currentSize}</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 block">Varighet:</span>
                                <span className="text-stone-300">{currentDur}</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 block">Fullført:</span>
                                <span className="text-stone-300">{currentComp}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProject(proj.id);
                                setProjectForm({
                                  title: currentTitle,
                                  location: currentLoc,
                                  size: currentSize,
                                  duration: currentDur,
                                  completionYear: currentComp,
                                });
                              }}
                              className="w-full bg-stone-900 hover:bg-brand-taupe/20 border border-white/5 hover:border-brand-taupe/20 text-stone-300 hover:text-brand-taupe text-[10px] font-mono tracking-widest uppercase py-2 transition-all cursor-pointer"
                            >
                              {lang === "no" ? "✏️ Rediger Tekster" : "✏️ Edit Texts"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 CONTENT: GMAIL INBOX & OUTBOX COUPLER */}
        {activeTab === "gmail" && (
          <div className="space-y-8 animate-fadeIn text-left">
            {/* Header / Info Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-950/40 border border-white/5 p-6 rounded-none">
              <div>
                <h3 className="text-base font-bold font-sans tracking-widest uppercase text-stone-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-taupe" />
                  {lang === "no" ? "Google Workspace Gmail-kobling" : "Google Workspace Gmail Integration"}
                </h3>
                <p className="text-stone-400 text-xs font-light mt-1 max-w-2xl leading-relaxed">
                  {lang === "no"
                    ? "Besvar kundehenvendelser og jobbsøknader direkte via din personlige eller bedriftens Gmail-konto. All kommunikasjon skjer sikkert."
                    : "Reply to quote inquiries and job applications directly using your personal or corporate Gmail account securely."}
                </p>
              </div>

              {googleToken && googleUser && (
                <div className="flex items-center gap-4 border-l border-white/10 pl-0 sm:pl-6">
                  {googleUser.photoURL && (
                    <img 
                      src={googleUser.photoURL} 
                      alt={googleUser.displayName || "User"} 
                      className="w-8 h-8 rounded-full border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <p className="text-xs font-mono font-bold text-white leading-none">
                      {googleUser.displayName || "Google Bruker"}
                    </p>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                      {googleUser.email}
                    </p>
                  </div>
                  <button
                    onClick={handleGoogleLogout}
                    className="ml-2 text-[10px] uppercase font-mono tracking-wider border border-red-500/25 bg-red-500/5 hover:bg-red-500/10 text-red-400 py-1.5 px-3 transition-colors cursor-pointer"
                  >
                    {lang === "no" ? "Logg ut" : "Log out"}
                  </button>
                </div>
              )}
            </div>

            {/* Main Email Workspace */}
            {!googleToken ? (
              <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-stone-950/60 min-h-[300px] text-center">
                <div className="w-16 h-16 bg-white/[0.02] border border-white/5 flex items-center justify-center text-brand-taupe mb-6 rounded-none">
                  <Mail className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-stone-200 mb-2">
                  {lang === "no" ? "Koble til din Google-konto" : "Connect Your Google Account"}
                </h4>
                <p className="text-stone-400 text-xs font-light max-w-md leading-relaxed mb-8">
                  {lang === "no"
                    ? "Logg på med din Google-konto for å gi applikasjonen tillatelse til å hente innboksen og sende e-poster på dine vegne."
                    : "Sign in with Google to authorize the application to fetch your inbox and send emails on your behalf with permission."}
                </p>

                {/* Official Material Google Sign-In Button */}
                <button 
                  onClick={handleGoogleLogin}
                  className="gsi-material-button group relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-stone-800 cursor-pointer"
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper flex items-center justify-center bg-white text-stone-900 py-3 px-6 gap-3">
                    <div className="gsi-material-button-icon shrink-0">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents text-xs font-mono font-bold tracking-wider uppercase text-stone-900">
                      {lang === "no" ? "Logg på med Google" : "Sign in with Google"}
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => loadGmailInbox(googleToken!)}
                      disabled={gmailLoading}
                      className="flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-stone-300 py-2 px-4 text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${gmailLoading ? "animate-spin text-brand-taupe" : ""}`} />
                      <span>{lang === "no" ? "Oppdater" : "Refresh"}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setReplyTo("");
                        setReplySubject("");
                        setReplyBody("");
                        setShowReplyModal(true);
                      }}
                      className="flex items-center gap-2 border border-brand-taupe bg-brand-taupe/10 hover:bg-brand-taupe text-brand-taupe hover:text-brand-charcoal py-2 px-4 text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{lang === "no" ? "Skriv ny e-post" : "Compose Email"}</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                    {lang === "no" ? `Viser ${gmailMessages.length} meldinger` : `Showing ${gmailMessages.length} messages`}
                  </span>
                </div>

                {/* Inbox Messages list */}
                {gmailLoading ? (
                  <div className="flex flex-col items-center justify-center p-12 min-h-[250px]">
                    <RefreshCw className="w-8 h-8 text-brand-taupe animate-spin mb-4" />
                    <p className="text-xs font-mono text-stone-500 uppercase tracking-widest">
                      {lang === "no" ? "Henter innboks..." : "Syncing inbox..."}
                    </p>
                  </div>
                ) : gmailError ? (
                  <div className="flex flex-col items-center justify-center p-12 border border-red-500/10 bg-red-500/5 text-red-400 min-h-[200px] text-center">
                    <AlertCircle className="w-8 h-8 mb-3 text-red-500" />
                    <p className="text-xs font-mono uppercase tracking-wider mb-2 font-bold">{gmailError}</p>
                    <button 
                      onClick={handleGoogleLogin}
                      className="text-xs font-mono underline hover:text-white"
                    >
                      {lang === "no" ? "Klikk her for å koble til på nytt" : "Click here to re-authorize"}
                    </button>
                  </div>
                ) : gmailMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 border border-white/5 bg-stone-950/20 text-stone-500 min-h-[200px]">
                    <Mail className="w-8 h-8 mb-3 text-stone-700" />
                    <p className="text-xs font-mono uppercase tracking-wider">
                      {lang === "no" ? "Innboksen er tom" : "Inbox is empty"}
                    </p>
                  </div>
                ) : (
                  <div className="border border-white/5 bg-stone-950/40 divide-y divide-white/5">
                    {gmailMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className="p-5 hover:bg-white/[0.01] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-white truncate max-w-[200px] block">
                              {msg.from}
                            </span>
                            <span className="text-[9px] text-stone-500 font-mono">
                              {msg.date}
                            </span>
                          </div>
                          
                          <h4 className="text-xs font-bold text-brand-taupe uppercase tracking-wider truncate">
                            {msg.subject}
                          </h4>
                          
                          <p className="text-stone-400 text-xs font-light line-clamp-1">
                            {msg.snippet}
                          </p>
                        </div>

                        {/* Message Actions */}
                        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                          <button
                            onClick={() => {
                              // Open response composer
                              setReplyTo(msg.from.replace(/.*<(.+)>/, "$1").trim());
                              setReplySubject(msg.subject.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`);
                              setReplyBody(`\n\nOn ${msg.date}, ${msg.from} wrote:\n> ${msg.snippet}`);
                              setShowReplyModal(true);
                            }}
                            className="flex-1 md:flex-none border border-brand-taupe/30 bg-brand-taupe/5 hover:bg-brand-taupe text-brand-taupe hover:text-brand-charcoal text-[9px] font-mono tracking-widest uppercase py-2 px-3 transition-colors cursor-pointer"
                          >
                            {lang === "no" ? "SVAR" : "REPLY"}
                          </button>
                          
                          <button
                            onClick={() => handleTrashMessage(msg.id)}
                            className="border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 p-2 transition-colors cursor-pointer"
                            title={lang === "no" ? "Slett e-post" : "Delete Email"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* COMPOSER / REPLY MODAL OVERLAY */}
        <AnimatePresence>
          {showReplyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReplyModal(false)}
                className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative bg-stone-900 border border-white/10 w-full max-w-lg shadow-2xl flex flex-col rounded-none text-left z-10"
              >
                <div className="h-1 bg-brand-taupe w-full shrink-0" />

                {/* Header */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-brand-taupe" />
                    <span>{lang === "no" ? "Skriv e-post via Gmail" : "Compose Email via Gmail"}</span>
                  </h4>
                  <button 
                    onClick={() => setShowReplyModal(false)}
                    className="text-stone-400 hover:text-white text-xs font-mono uppercase tracking-wider p-1 hover:bg-white/5"
                  >
                    Lukk
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSendEmail} className="p-5 space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                      {lang === "no" ? "Til (Mottaker)" : "To (Recipient)"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="epost@adresse.no"
                      value={replyTo}
                      onChange={(e) => setReplyTo(e.target.value)}
                      className="w-full bg-stone-950 border border-white/10 focus:border-brand-taupe text-xs text-white py-2 px-3 rounded-none outline-none transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                      {lang === "no" ? "Emne" : "Subject"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === "no" ? "Angående..." : "Regarding..."}
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full bg-stone-950 border border-white/10 focus:border-brand-taupe text-xs text-white py-2 px-3 rounded-none outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                      {lang === "no" ? "Meldingstekst" : "Message Body"}
                    </label>
                    <textarea
                      required
                      rows={8}
                      placeholder={lang === "no" ? "Skriv din melding her..." : "Type your message here..."}
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      className="w-full bg-stone-950 border border-white/10 focus:border-brand-taupe text-xs text-white p-3 rounded-none outline-none transition-colors font-sans leading-relaxed resize-none scrollbar-thin"
                    />
                  </div>

                  {/* Submit Toolbar */}
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReplyModal(false)}
                      className="border border-stone-800 hover:border-white/10 text-stone-400 hover:text-white text-[10px] font-mono tracking-widest uppercase py-2.5 px-4 transition-all"
                    >
                      {lang === "no" ? "Avbryt" : "Cancel"}
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSending}
                      className="bg-brand-taupe hover:bg-white text-brand-charcoal hover:shadow-lg text-[10px] font-bold tracking-widest uppercase py-2.5 px-5 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      {isSending ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>{lang === "no" ? "Sender..." : "Sending..."}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>{lang === "no" ? "Send e-post" : "Send Email"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
