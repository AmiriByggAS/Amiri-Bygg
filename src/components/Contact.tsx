import React, { useState, useRef, useEffect } from "react";
import { Phone, Mail, MapPin, CheckCircle, Upload, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationSchema } from "../translations";

interface ContactProps {
  t: TranslationSchema;
  selectedService: string;
  setSelectedService: (service: string) => void;
  onNewLeadSubmitted: () => void;
}

export default function Contact({
  t,
  selectedService,
  setSelectedService,
  onNewLeadSubmitted,
}: ContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mailtoLink, setMailtoLink] = useState("");

  // File states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const budgetClasses = [
    { value: "under-100k", label: t.nav.about === "Om oss" ? "Under 100 000 kr" : "Under NOK 100k" },
    { value: "100k-500k", label: t.nav.about === "Om oss" ? "100 000 - 500 000 kr" : "NOK 100k - 500k" },
    { value: "500k-1m", label: t.nav.about === "Om oss" ? "500 000 - 1 000 000 kr" : "NOK 500k - 1M" },
    { value: "over-1m", label: t.nav.about === "Om oss" ? "Over 1 000 000 kr" : "Over NOK 1M" },
  ];

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
    
    if (e.dataTransfer.files) {
      const filesArr = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !selectedService) return;

    const emailRecipient = "info@amiribygg.no";
    const emailSubject = `Ny forespørsel fra Amiri Bygg nettside - ${name}`;
    const emailBody = `Hei Amiri Bygg,\n\n` +
      `Her er en ny forespørsel sendt fra nettsiden:\n\n` +
      `Navn: ${name}\n` +
      `E-post: ${email}\n` +
      `Telefon: ${phone}\n` +
      `Ønsket tjeneste: ${selectedService}\n` +
      `Estimert budsjett: ${budget || "Ikke oppgitt"}\n\n` +
      `Beskrivelse/Melding:\n${message}\n\n` +
      `Vennlig hilsen,\n${name}`;

    const link = `mailto:${emailRecipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    setMailtoLink(link);

    // Persist lead in localStorage
    const newLead = {
      id: Date.now(),
      name,
      email,
      phone,
      service: selectedService,
      budget,
      message,
      filesCount: uploadedFiles.length,
      submittedAt: new Date().toISOString(),
      status: "new",
    };

    const existingLeads = JSON.parse(localStorage.getItem("amiri_leads") || "[]");
    localStorage.setItem("amiri_leads", JSON.stringify([newLead, ...existingLeads]));

    setIsSubmitted(true);
    onNewLeadSubmitted();

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
      setBudget("");
      setMessage("");
      setUploadedFiles([]);
      setIsSubmitted(false);
      setMailtoLink("");
    }, 20000);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-3">
            {t.nav.contact}
          </p>
          <h2 className="text-3xl sm:text-4xl font-sans font-semibold tracking-tight text-stone-900 mb-4">
            {t.contact.title}
          </h2>
          <div className="w-16 h-1 bg-brand-taupe mx-auto mb-6" />
          <p className="text-stone-600 font-light leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Form + Information Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Premium Contact details & Map */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Quick response promise card */}
            <div className="bg-brand-charcoal text-white p-8 border border-white/5 border-l-4 border-l-brand-taupe shadow-md rounded-none">
              <ShieldCheck className="w-8 h-8 text-brand-taupe mb-4 animate-pulse" />
              <h3 className="text-sm font-bold font-sans tracking-widest mb-2 uppercase text-white">
                {t.contact.promiseTitle}
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                {t.contact.promiseText}
              </p>
            </div>

            {/* Direct contact lists */}
            <div className="space-y-6">
              <a
                id="contact-call-link"
                href="tel:+4790061211"
                className="flex items-center gap-4 p-4 border border-stone-200 hover:border-brand-taupe bg-brand-sand hover:bg-white transition-all duration-300 rounded-none"
              >
                <div className="w-10 h-10 rounded-none bg-brand-charcoal border border-white/5 flex items-center justify-center text-brand-taupe">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase text-stone-400 tracking-wider mb-0.5">
                    {t.contact.phoneText}
                  </p>
                  <p className="text-sm font-bold text-brand-charcoal">900 61 211</p>
                </div>
              </a>

              <a
                id="contact-email-link"
                href="mailto:info@amiribygg.no"
                className="flex items-center gap-4 p-4 border border-stone-200 hover:border-brand-taupe bg-brand-sand hover:bg-white transition-all duration-300 rounded-none"
              >
                <div className="w-10 h-10 rounded-none bg-brand-charcoal border border-white/5 flex items-center justify-center text-brand-taupe">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase text-stone-400 tracking-wider mb-0.5">
                    {t.contact.emailText}
                  </p>
                  <p className="text-sm font-bold text-brand-charcoal">info@amiribygg.no</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 border border-stone-100 bg-brand-sand rounded-none">
                <div className="w-10 h-10 rounded-none bg-brand-charcoal border border-white/5 flex items-center justify-center text-brand-taupe">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase text-stone-400 tracking-wider mb-0.5">
                    {t.contact.officeText}
                  </p>
                  <p className="text-sm font-bold text-brand-charcoal">Viggo Hansteens vei, 1472 Fjellhamar</p>
                </div>
              </div>
            </div>

            {/* Expanded Real Interactive Google Maps and Service Coverage */}
            <div className="border border-stone-200 bg-brand-sand p-6 flex flex-col justify-between rounded-none space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-brand-charcoal tracking-widest uppercase">
                    Vårt Dekningsområde & Hovedkontor
                  </span>
                  <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider mt-0.5">
                    Oslo, Viken & Omegn
                  </span>
                </div>
                <span className="flex items-center gap-1.5 bg-brand-taupe/15 px-2 py-0.5 border border-brand-taupe/20">
                  <span className="w-2 h-2 rounded-full bg-brand-taupe animate-pulse" />
                  <span className="text-[8px] font-mono text-brand-taupe font-bold tracking-wider uppercase">AKTIVT</span>
                </span>
              </div>

              {/* Real Embedded Google Maps Iframe */}
              <div className="w-full h-72 relative bg-stone-100 border border-stone-200 overflow-hidden rounded-none shadow-xs">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1999.043818318281!2d10.985923177694925!3d59.93145456279435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46417b01b63db37d%3A0xc6cbfa7d013fa09f!2sViggo%20Hansteens%20vei%2022%2C%201472%20Fjellhamar!5e0!3m2!1sno!2sno!4v1719280000000!5m2!1sno!2sno" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: "grayscale(0.1) contrast(1.05)" }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Amiri Bygg Hovedkontor"
                ></iframe>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1.5">
                  Vi dekker blant annet:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Oslo", "Lørenskog", "Fjellhamar", "Lillestrøm", "Rælingen", "Skedsmo", "Bærum", "Asker", "Nordre Follo", "Nittedal"].map((region) => (
                    <span 
                      key={region} 
                      className="text-[9px] font-mono bg-white border border-stone-200 text-stone-600 px-2 py-0.5 hover:border-brand-taupe transition-colors duration-200"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Quote Request form */}
          <div id="contact-form-anchor" className="lg:col-span-7 bg-white p-8 md:p-12 border border-stone-200 border-l-4 border-l-brand-taupe shadow-xs rounded-none">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="contact-form"
                  id="quote-request-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-widest text-brand-charcoal mb-1 font-sans">
                      {t.contact.formTitle}
                    </h3>
                    <p className="text-stone-400 text-xs font-light">
                      {t.contact.formDesc}
                    </p>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                        {t.contact.fieldName} *
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-brand-sand border border-stone-200 py-2.5 px-4 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand-taupe transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                        {t.contact.fieldEmail} *
                      </label>
                      <input
                        id="form-email"
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
                        {t.contact.fieldPhone} *
                      </label>
                      <input
                        id="form-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-brand-sand border border-stone-200 py-2.5 px-4 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand-taupe transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                        {t.contact.fieldService} *
                      </label>
                      <select
                        id="form-service"
                        required
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full bg-brand-sand border border-stone-200 py-2.5 px-4 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand-taupe transition-colors h-11"
                      >
                        <option value="">-- {t.nav.about === "Om oss" ? "Velg tjeneste" : "Select service"} --</option>
                        {Object.entries(t.services.items).map(([key, data]) => (
                          <option key={key} value={key}>
                            {data.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Budget Segment Selectors */}
                  <div>
                    <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                      {t.contact.fieldBudget}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {budgetClasses.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          id={`budget-btn-${item.value}`}
                          onClick={() => setBudget(item.value)}
                          className={`py-2 px-3 text-center border text-[10px] font-mono tracking-widest uppercase transition-all rounded-none ${
                            budget === item.value
                              ? "bg-brand-charcoal text-white border-brand-charcoal font-bold"
                              : "bg-brand-sand border-stone-200 hover:border-brand-taupe text-stone-600"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                      {t.contact.fieldMessage} *
                    </label>
                    <textarea
                      id="form-message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-brand-sand border border-stone-200 py-2.5 px-4 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand-taupe transition-colors resize-none"
                    />
                  </div>

                  {/* Drag-and-drop structural sketch/floorplan upload area */}
                  <div>
                    <label className="block text-stone-700 text-xs font-mono uppercase tracking-widest mb-2">
                      {t.contact.fieldFiles}
                    </label>
                    <div
                      id="sketch-dropzone"
                      className={`border-2 border-dashed p-6 text-center transition-colors relative cursor-pointer rounded-none ${
                        dragActive
                          ? "border-brand-taupe bg-brand-sand"
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
                        id="floorplan-file-input"
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*,.pdf,.dwg"
                        onChange={handleChange}
                      />
                      <div className="flex flex-col items-center gap-2 text-stone-500">
                        <Upload className="w-8 h-8 text-brand-taupe mb-1" />
                        <p className="text-xs sm:text-sm font-bold text-brand-charcoal">
                          {t.nav.about === "Om oss" ? "Dra og slipp filer her, eller klikk for å velge" : "Drag & drop floor plans here, or click to browse"}
                        </p>
                        <p className="text-[10px] font-light text-stone-400">PDF, JPG, PNG, DWG up to 20MB</p>
                      </div>
                    </div>

                    {/* Show uploaded lists */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 bg-brand-sand border border-stone-200 text-[10px] font-mono rounded-none">
                            <span className="text-stone-700 font-bold truncate max-w-[250px]">{file.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-stone-400">{(file.size / 1024).toFixed(0)} KB</span>
                              <button
                                type="button"
                                id={`remove-sketch-${i}`}
                                onClick={() => removeFile(i)}
                                className="text-red-500 hover:text-red-700 uppercase font-bold text-[9px] tracking-wider"
                              >
                                {t.nav.about === "Om oss" ? "Slett" : "Delete"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    id="submit-contact-form"
                    type="submit"
                    className="w-full bg-brand-charcoal hover:bg-brand-taupe text-white text-[10px] font-bold tracking-widest uppercase py-4.5 rounded-none transition-colors duration-300 shadow-xs flex items-center justify-center gap-2 group"
                  >
                    <span>{t.contact.submitButton}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  className="flex flex-col items-center justify-center text-center py-16"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-16 h-16 bg-brand-taupe text-brand-charcoal rounded-none flex items-center justify-center mb-6 shadow-md">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-brand-charcoal mb-3 font-sans">
                    {t.contact.successTitle}
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-sm max-w-md font-light leading-relaxed mb-6">
                    {t.nav.about === "Om oss" 
                      ? "Forespørselen din er lagret i vårt system! E-postprogrammet ditt åpnes nå automatisk slik at du kan sende den ferdige e-posten direkte til oss. Hvis det ikke åpnet seg, vennligst klikk på knappen under for å fullføre sendingen."
                      : "Your inquiry has been saved in our system! Your email application is opening to send the prefilled details directly to us. If it did not open, please click the button below to complete."}
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
                      setBudget("");
                      setMessage("");
                      setUploadedFiles([]);
                      setIsSubmitted(false);
                      setMailtoLink("");
                    }}
                    className="text-stone-400 hover:text-stone-600 text-[10px] font-semibold tracking-wider underline cursor-pointer"
                  >
                    {t.nav.about === "Om oss" ? "Send en ny henvendelse" : "Send another inquiry"}
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
