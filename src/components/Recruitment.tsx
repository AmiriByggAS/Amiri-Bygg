import React, { useState, useRef } from "react";
import { Upload, CheckCircle, FileText, Briefcase, Award, GraduationCap, Building, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationSchema } from "../translations";

interface RecruitmentProps {
  t: TranslationSchema;
  onNewApplicationSubmitted: () => void;
}

export default function Recruitment({ t, onNewApplicationSubmitted }: RecruitmentProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mailtoLink, setMailtoLink] = useState("");
  
  // File upload states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openPositions = [
    {
      role: t.nav.about === "Om oss" ? "Svenn / Faglært tømrer (Heltid)" : "Journeyman / Skilled Carpenter (Full-time)",
      type: t.nav.about === "Om oss" ? "Oslo & Viken" : "Oslo & Viken",
      icon: Award,
    },
    {
      role: t.nav.about === "Om oss" ? "Prosjektleder / Byggeleder" : "Project Manager / Construction Supervisor",
      type: t.nav.about === "Om oss" ? "Hovedkontor / Byggeplass" : "HQ & Building Sites",
      icon: Briefcase,
    },
    {
      role: t.nav.about === "Om oss" ? "Lærling tømrerfaget" : "Apprentice Carpenter",
      type: t.nav.about === "Om oss" ? "Oppstart Høst / Vår" : "Start Autumn / Spring",
      icon: GraduationCap,
    },
  ];

  // Drag & drop file handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !position) return;

    const emailRecipient = "info@amiribygg.no";
    const emailSubject = `Jobbsøknad hos Amiri Bygg - ${name} - Stilling: ${position}`;
    const emailBody = `Hei Amiri Bygg,\n\n` +
      `Jeg ønsker å søke på stillingen som "${position}" hos dere.\n\n` +
      `Her er mine opplysninger:\n` +
      `Navn: ${name}\n` +
      `E-post: ${email}\n` +
      `Telefon: ${phone}\n` +
      `Erfaring/Bakgrunn: ${experience || "Ikke oppgitt"}\n\n` +
      `Søknadstekst:\n${message || "Ingen søknadstekst lagt ved."}\n\n` +
      `Vennlig hilsen,\n${name}`;

    const link = `mailto:${emailRecipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    setMailtoLink(link);

    // Persist application in localStorage
    const newApp = {
      id: Date.now(),
      name,
      email,
      phone,
      position,
      experience,
      message,
      fileName: uploadedFile ? uploadedFile.name : "application-resume.pdf",
      submittedAt: new Date().toISOString(),
      status: "new",
    };

    const existingApps = JSON.parse(localStorage.getItem("amiri_applications") || "[]");
    localStorage.setItem("amiri_applications", JSON.stringify([newApp, ...existingApps]));

    setIsSubmitted(true);
    onNewApplicationSubmitted();

    // Trigger redirection to open email client
    try {
      window.location.href = link;
    } catch (err) {
      console.error("Could not trigger mailto automatically", err);
    }

    // Reset Form
    setTimeout(() => {
      setName("");
      setEmail("");
      setPhone("");
      setPosition("");
      setExperience("");
      setMessage("");
      setUploadedFile(null);
      setIsSubmitted(false);
      setMailtoLink("");
    }, 20000);
  };

  return (
    <section id="careers" className="py-24 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-3">
            {t.nav.careers}
          </p>
          <h2 className="text-3xl sm:text-4xl font-sans font-semibold tracking-tight text-stone-900 mb-4">
            {t.recruitment.title}
          </h2>
          <div className="w-16 h-1 bg-brand-taupe mx-auto mb-6" />
          <p className="text-stone-600 font-light leading-relaxed">
            {t.recruitment.subtitle}
          </p>
        </div>

        {/* Dual-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Why Work With Us & Open Roles */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h3 className="text-base font-bold uppercase tracking-widest text-brand-charcoal mb-4">
                {t.recruitment.whyJoinUs}
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed mb-6">
                {t.recruitment.cultureDesc}
              </p>
              
              {/* Culture point checks */}
              <div className="space-y-7 md:space-y-8">
                <div className="flex gap-4 items-start py-1">
                  <div className="w-6 h-6 shrink-0 rounded-none bg-brand-sand border border-stone-200 flex items-center justify-center text-brand-charcoal font-mono text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-charcoal leading-snug uppercase tracking-wide">{t.recruitment.benefitTitle1}</h4>
                    <p className="text-stone-500 text-xs sm:text-sm mt-1.5 leading-relaxed">{t.recruitment.benefitDesc1}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start py-1">
                  <div className="w-6 h-6 shrink-0 rounded-none bg-brand-sand border border-stone-200 flex items-center justify-center text-brand-charcoal font-mono text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-charcoal leading-snug uppercase tracking-wide">{t.recruitment.benefitTitle2}</h4>
                    <p className="text-stone-500 text-xs sm:text-sm mt-1.5 leading-relaxed">{t.recruitment.benefitDesc2}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start py-1">
                  <div className="w-6 h-6 shrink-0 rounded-none bg-brand-sand border border-stone-200 flex items-center justify-center text-brand-charcoal font-mono text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-charcoal leading-snug uppercase tracking-wide">{t.recruitment.benefitTitle3}</h4>
                    <p className="text-stone-500 text-xs sm:text-sm mt-1.5 leading-relaxed">{t.recruitment.benefitDesc3}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Roles list */}
            <div>
              <h3 className="text-base font-bold uppercase tracking-widest text-brand-charcoal mb-4">
                {t.recruitment.openPositions}
              </h3>
              <div className="space-y-3">
                {openPositions.map((pos, idx) => {
                  const RoleIcon = pos.icon;
                  return (
                    <div
                      key={idx}
                      id={`open-position-${idx}`}
                      className="border border-stone-200 bg-white p-4 flex items-center justify-between group hover:border-brand-taupe transition-colors rounded-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-sand text-brand-taupe border border-stone-200 flex items-center justify-center rounded-none">
                          <RoleIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-brand-charcoal">{pos.role}</h4>
                          <p className="text-stone-400 text-[9px] font-mono uppercase tracking-widest mt-0.5">{pos.type}</p>
                        </div>
                      </div>
                      <button
                        id={`apply-role-shortcut-${idx}`}
                        onClick={() => {
                          setPosition(pos.role);
                          setTimeout(() => {
                            const el = document.getElementById("recruitment-form-anchor");
                            if (el) {
                              const headerOffset = 95;
                              const elementPosition = el.getBoundingClientRect().top;
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                              window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                            }
                          }, 50);
                        }}
                        className="text-[10px] font-mono tracking-widest uppercase text-brand-taupe hover:text-brand-charcoal underline pr-1 font-bold"
                      >
                        {t.nav.about === "Om oss" ? "Søk" : "Apply"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Application Form */}
          <div id="recruitment-form-anchor" className="lg:col-span-7 bg-white p-8 md:p-10 border border-stone-200 border-l-4 border-l-brand-taupe shadow-xs relative rounded-none">
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="recruitment-form"
                  id="recruitment-application-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-widest text-brand-charcoal mb-1 font-sans">
                      {t.recruitment.formTitle}
                    </h3>
                    <p className="text-stone-400 text-xs font-light">
                      {t.recruitment.formDesc}
                    </p>
                  </div>

                  {/* Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                        {t.recruitment.fieldName} *
                      </label>
                      <input
                        id="rec-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-brand-sand border border-stone-200 py-2.5 px-4 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand-taupe transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                        {t.recruitment.fieldEmail} *
                      </label>
                      <input
                        id="rec-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-sand border border-stone-200 py-2.5 px-4 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand-taupe transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                        {t.recruitment.fieldPhone} *
                      </label>
                      <input
                        id="rec-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-brand-sand border border-stone-200 py-2.5 px-4 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand-taupe transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                        {t.recruitment.fieldPosition} *
                      </label>
                      <select
                        id="rec-position"
                        required
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full bg-brand-sand border border-stone-200 py-2.5 px-4 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand-taupe transition-colors h-11"
                      >
                        <option value="">-- {t.nav.about === "Om oss" ? "Velg stilling" : "Choose role"} --</option>
                        {openPositions.map((pos, i) => (
                          <option key={i} value={pos.role}>
                            {pos.role}
                          </option>
                        ))}
                        <option value="Annen stilling">{t.nav.about === "Om oss" ? "Åpen søknad (Annet)" : "Open Application (Other)"}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                      {t.recruitment.fieldExperience} (år)
                    </label>
                    <input
                      id="rec-experience"
                      type="number"
                      min="0"
                      max="50"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-brand-sand border border-stone-200 py-2.5 px-4 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand-taupe transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                      {t.recruitment.fieldMessage}
                    </label>
                    <textarea
                      id="rec-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-brand-sand border border-stone-200 py-2.5 px-4 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand-taupe transition-colors resize-none"
                    />
                  </div>

                  {/* Drag-and-Drop Resume File Upload Area */}
                  <div>
                    <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                      {t.recruitment.fieldResume}
                    </label>
                    <div
                      id="resume-dropzone"
                      className={`border-2 border-dashed p-6 text-center transition-colors relative cursor-pointer rounded-none ${
                        dragActive
                          ? "border-brand-taupe bg-brand-sand"
                          : uploadedFile
                          ? "border-emerald-500 bg-emerald-50/20"
                          : "border-stone-200 bg-brand-sand hover:border-brand-taupe"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={triggerFileSelect}
                    >
                      <input
                        ref={fileInputRef}
                        id="rec-file-input"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                      />
                      
                      {uploadedFile ? (
                        <div className="flex flex-col items-center gap-2 text-emerald-700">
                          <CheckCircle className="w-8 h-8" />
                          <p className="text-xs sm:text-sm font-bold">{uploadedFile.name}</p>
                          <p className="text-[10px] font-mono uppercase text-stone-400">
                            {(uploadedFile.size / 1024).toFixed(1)} KB • {t.nav.about === "Om oss" ? "Klikk for å endre" : "Click to change"}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-stone-500">
                          <Upload className="w-8 h-8 text-brand-taupe mb-1" />
                          <p className="text-xs sm:text-sm font-bold text-brand-charcoal">{t.recruitment.dragDropResume}</p>
                          <p className="text-[10px] font-light text-stone-400">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    id="submit-recruitment-btn"
                    type="submit"
                    className="w-full bg-brand-charcoal hover:bg-brand-taupe text-white text-[10px] font-bold tracking-widest uppercase py-4.5 rounded-none transition-colors duration-300 shadow-xs"
                  >
                    {t.recruitment.submitApplication}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="recruitment-success"
                  className="flex flex-col items-center justify-center text-center py-12"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-16 h-16 bg-brand-taupe text-brand-charcoal rounded-none flex items-center justify-center mb-6 shadow-md">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-brand-charcoal mb-3 font-sans">
                    {t.recruitment.successTitle}
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-sm max-w-md font-light leading-relaxed mb-6">
                    {t.nav.about === "Om oss" 
                      ? "Søknaden din er lagret i vårt system! E-postprogrammet ditt åpnes nå automatisk slik at du kan sende søknadsdetaljene direkte til oss. Hvis det ikke åpnet seg, vennligst klikk på knappen under for å fullføre sendingen."
                      : "Your application has been saved in our system! Your email application is opening to send your details directly to us. If it did not open, please click the button below to complete."}
                  </p>

                  {mailtoLink && (
                    <a
                      href={mailtoLink}
                      className="inline-flex items-center justify-center gap-2 bg-brand-taupe hover:bg-brand-charcoal hover:text-white text-brand-charcoal text-[10px] font-bold tracking-widest uppercase py-3.5 px-6 rounded-none transition-colors duration-300 mb-4 shadow-xs"
                    >
                      <span>{t.nav.about === "Om oss" ? "ÅPNE E-POST MANUELT" : "OPEN EMAIL MANUALLY"}</span>
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setName("");
                      setEmail("");
                      setPhone("");
                      setPosition("");
                      setExperience("");
                      setMessage("");
                      setUploadedFile(null);
                      setIsSubmitted(false);
                      setMailtoLink("");
                    }}
                    className="text-stone-400 hover:text-stone-600 text-[10px] font-semibold tracking-wider underline cursor-pointer"
                  >
                    {t.nav.about === "Om oss" ? "Send en ny søknad" : "Send another application"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
