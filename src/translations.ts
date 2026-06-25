export interface ServiceDetail {
  title: string;
  description: string;
  fullDetails: string;
  badge: string;
}

export interface TranslationSchema {
  nav: {
    services: string;
    portfolio: string;
    process: string;
    careers: string;
    about: string;
    faq: string;
    contact: string;
    admin: string;
    requestQuote: string;
    callUs: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustTitle: string;
    badge1: string;
    badge2: string;
    badge3: string;
    badge4: string;
  };
  trust: {
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
    card5Title: string;
    card5Desc: string;
    card6Title: string;
    card6Desc: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
    stat4Label: string;
  };
  services: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    catConstruction: string;
    catInterior: string;
    catManagement: string;
    items: {
      totalrenovering: ServiceDetail;
      oppussing: ServiceDetail;
      kjokken: ServiceDetail;
      bad: ServiceDetail;
      gulv: ServiceDetail;
      tak: ServiceDetail;
      vegger: ServiceDetail;
      innvendig: ServiceDetail;
      utvendig: ServiceDetail;
      tilbygg: ServiceDetail;
      rehabilitering: ServiceDetail;
      fasade: ServiceDetail;
      terrasse: ServiceDetail;
      prosjektledelse: ServiceDetail;
      totalentreprise: ServiceDetail;
    };
    quickQuoteTitle: string;
    quickQuoteDesc: string;
    selectService: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterRenovation: string;
    filterKitchenBath: string;
    filterExterior: string;
    beforeAfterTitle: string;
    beforeLabel: string;
    afterLabel: string;
    dragSliderHint: string;
    projectCompleted: string;
    size: string;
    duration: string;
  };
  process: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    ratingText: string;
    badgeTitle: string;
  };
  recruitment: {
    title: string;
    subtitle: string;
    whyJoinUs: string;
    cultureTitle: string;
    cultureDesc: string;
    benefitTitle1: string;
    benefitDesc1: string;
    benefitTitle2: string;
    benefitDesc2: string;
    benefitTitle3: string;
    benefitDesc3: string;
    openPositions: string;
    formTitle: string;
    formDesc: string;
    fieldName: string;
    fieldEmail: string;
    fieldPhone: string;
    fieldPosition: string;
    fieldExperience: string;
    fieldMessage: string;
    fieldResume: string;
    dragDropResume: string;
    submitApplication: string;
    successTitle: string;
    successMessage: string;
  };
  about: {
    title: string;
    subtitle: string;
    p1: string;
    p2: string;
    p3: string;
    badgeQuality: string;
    badgeReliability: string;
    badgeEco: string;
  };
  faq: {
    title: string;
    subtitle: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
    q5: string;
    a5: string;
  };
  contact: {
    title: string;
    subtitle: string;
    formTitle: string;
    formDesc: string;
    fieldName: string;
    fieldEmail: string;
    fieldPhone: string;
    fieldService: string;
    fieldBudget: string;
    fieldMessage: string;
    fieldFiles: string;
    submitButton: string;
    promiseTitle: string;
    promiseText: string;
    phoneText: string;
    emailText: string;
    officeText: string;
    successTitle: string;
    successMessage: string;
  };
}

export const translations: Record<"no" | "en", TranslationSchema> = {
  no: {
    nav: {
      services: "Tjenester",
      portfolio: "Prosjekter",
      process: "Vår prosess",
      careers: "Karriere",
      about: "Om oss",
      faq: "FAQ",
      contact: "Kontakt",
      admin: "Admin",
      requestQuote: "Få gratis tilbud",
      callUs: "Ring oss",
    },
    hero: {
      headline: "Fra idé til nøkkelferdig resultat.",
      subheadline: "Vi hjelper deg gjennom hele prosjektet – fra planlegging til ferdig leveranse. Én samarbeidspartner. Én prosess. Ett resultat du kan være stolt av.",
      ctaPrimary: "Få gratis befaring",
      ctaSecondary: "Se våre prosjekter",
      trustTitle: "Sertifisert og godkjent entreprenør",
      badge1: "Sentralt Godkjent",
      badge2: "Våtromsertifisert",
      badge3: "10 Års Garanti",
      badge4: "Fagutdannede Håndverkere",
    },
    trust: {
      title: "Hvorfor velge Amiri Bygg?",
      subtitle: "Vi kombinerer solid håndverk, skandinavisk presisjon og ryddig prosjektstyring for å gi deg en trygg og profesjonell byggeprosess.",
      card1Title: "Totalentreprise",
      card1Desc: "Vi tar fullt ansvar for alt fra søknadsprosess og tegninger til tømrerarbeid, rørlegger, elektriker og ferdigstillelse.",
      card2Title: "Pålitelig fremdrift",
      card2Desc: "Vi utarbeider detaljerte fremdriftsplaner og leverer til avtalt tid. Forutsigbarhet er vår høyeste prioritet.",
      card3Title: "Solid fagkompetanse",
      card3Desc: "Vårt team består av faglærte tømrere og sertifiserte samarbeidspartnere med lang erfaring i det norske markedet.",
      card4Title: "Kvalitetsgaranti",
      card4Desc: "Vi bruker kun godkjente kvalitetsmaterialer tilpasset det nordiske klimaet, og gir solide garantier på alt utført arbeid.",
      card5Title: "Tett oppfølging",
      card5Desc: "Du får en fast prosjektleder å forholde deg til gjennom hele prosessen. Ingen misforståelser, kun klare linjer.",
      card6Title: "Konkurransedyktige priser",
      card6Desc: "Vi leverer premium kvalitet til avtalte og rettferdige priser, helt uten skjulte kostnader eller ubehagelige overraskelser.",
      stat1Label: "Fullførte prosjekter",
      stat2Label: "Kundetilfredshet",
      stat3Label: "Fagfolk på teamet",
      stat4Label: "Ansvarsforsikring",
    },
    services: {
      title: "Våre Tjenester",
      subtitle: "Vi leverer alt fra mindre oppussingsprosjekter til store totalentrepriser og tilbygg. Ingen jobb er for stor, ingen for liten.",
      searchPlaceholder: "Søk etter en tjeneste...",
      allCategories: "Alle tjenester",
      catConstruction: "Bygg & Konstruksjon",
      catInterior: "Innvendig & Renovering",
      catManagement: "Prosjektledelse & Entreprise",
      items: {
        totalrenovering: {
          title: "Totalrenovering",
          description: "Fullstendig fornyelse av eldre boliger og næringsbygg til moderne standard.",
          fullDetails: "Vi forvandler slitne boliger til moderne drømmehjem. Vår totalrenovering dekker alt fra etterisolering, bytte av vinduer, nye overflater, rør- og elektroinstallasjon til fullstendig ombygging av romløsning.",
          badge: "Mest populær",
        },
        oppussing: {
          title: "Oppussing",
          description: "Overflateoppussing, maling, sparkling og modernisering av alle rom.",
          fullDetails: "Trenger hjemmet et ansiktsløft? Vi hjelper deg med sparkling, maling, tapetsering, montering av listverk og generell oppgradering av dine oppholdsrom med fokus på tidsriktig finish og høy presisjon.",
          badge: "Innvendig",
        },
        kjokken: {
          title: "Kjøkken",
          description: "Montering og skreddersøm av moderne kjøkkenløsninger med perfekt finish.",
          fullDetails: "Kjøkkenet er boligens hjerte. Vi river det gamle kjøkkenet, legger opp nye rør og strømpunkter, retter av vegger, monterer skapstammer, fronter, benkeplater og integrerte hvitevarer med millimeterpresisjon.",
          badge: "Spesialitet",
        },
        bad: {
          title: "Bad & Våtrom",
          description: "Bygging og renovering av bad i henhold til våtromsnormen (BVN).",
          fullDetails: "Vi bygger trygge og estetiske bad som varer i tiår. Som sertifisert våtromsbedrift leverer vi bad med full dokumentasjon i Boligmappa, membranarbeid, flislegging og rørleggerarbeid av høyeste kvalitet.",
          badge: "Sertifisert",
        },
        gulv: {
          title: "Gulvlegging",
          description: "Legging av parkett, laminat, tregulv og heltre med listverk.",
          fullDetails: "Et vakkert gulv definerer rommet. Vi hjelper deg med å velge riktig underlag, rette av skjeve undergulv, og legge parkett, laminat, klikkvinyl eller heltre med perfekt tilpassede lister.",
          badge: "Innvendig",
        },
        tak: {
          title: "Taktekking",
          description: "Renovering, reparasjon og legging av nye takstein og takshingel.",
          fullDetails: "Sikre boligen mot vær og vind. Vi utfører fullstendig takomtekking, bytter lekter og undertak, monterer ny takstein, shingel eller plater, samt monterer nye takrenner og nedløp.",
          badge: "Utvendig",
        },
        vegger: {
          title: "Vegger & Gips",
          description: "Oppsetting av lettvegger, isolering, gipsing og sparkling.",
          fullDetails: "Vi endrer romløsninger ved å sette opp solide lettvegger med god lydisolering. Vi monterer gipsplater, sparkler og strimler i henhold til standarder for helt slette, malingsklare overflater.",
          badge: "Innvendig",
        },
        innvendig: {
          title: "Innvendig arbeid",
          description: "Snekkerarbeid, listing, dørmontering og romløsninger.",
          fullDetails: "Komplett tømrerarbeid innendørs. Montering av innerdører, skyvedører, vinduer, fôringer, tak- og gulvlister, samt tilpasning av innebygde skapløsninger og trapper.",
          badge: "Innvendig",
        },
        utvendig: {
          title: "Utvendig arbeid",
          description: "Utskifting av kledning, vinduer, etterisolering og detaljer.",
          fullDetails: "Beskytt og oppgrader boligens ytre. Vi utfører utskifting av råteskadet eller utdatert kledning, monterer moderne lavenergivinduer, etterisolerer og monterer fine vindusomramminger.",
          badge: "Utvendig",
        },
        tilbygg: {
          title: "Tilbygg & Påbygg",
          description: "Utvidelse av boligen med nye rom, inngangspartier eller etasjer.",
          fullDetails: "Trenger familien mer plass? Vi bygger sømløse tilbygg og påbygg som harmonerer med eksisterende arkitektur. Vi bistår også med tegningsgrunnlag og byggesøknad til kommunen.",
          badge: "Premium",
        },
        rehabilitering: {
          title: "Rehabilitering",
          description: "Skånsom oppgradering og bevaring av eldre og verneverdige bygg.",
          fullDetails: "Vi har spesialkompetanse innen rehabilitering av eldre trehusbebyggelse og bygårder. Vi ivaretar særpreg og sjel samtidig som vi oppgraderer isolasjonsevne og tekniske standarder.",
          badge: "Spesialitet",
        },
        fasade: {
          title: "Fasadeoppgradering",
          description: "Modernisering av fasader med ny isolasjon, kledning og stil.",
          fullDetails: "Gi boligen et moderne uttrykk og lavere strømregning. Vi etterisolerer yttervegger, monterer ny moderne kledning (f.eks. malmfuru, termoask eller klassisk trevirke) og oppgraderer fasadens estetikk.",
          badge: "Utvendig",
        },
        terrasse: {
          title: "Terrasse & Uterom",
          description: "Bygging av skreddersydde terrasser, plattinger og levegger.",
          fullDetails: "Vi designer og bygger eksklusive terrasser og uterom tilpasset terrenget. Vi bruker alt fra impregnert trevirke til premium kompositt, sibirsk lerk og termoask, komplett med rekkverk og belysningsløsninger.",
          badge: "Uterom",
        },
        prosjektledelse: {
          title: "Prosjektledelse",
          description: "Profesjonell koordinering av alle fagfelt og tidsplaner.",
          fullDetails: "Slipp stresset med å koordinere ulike håndverkere. Vår erfarne prosjektleder styrer tidslinjen, følger opp rørleggere, elektrikere, tømrere og malere, og påser at alt arbeid dokumenteres korrekt.",
          badge: "Ledelse",
        },
        totalentreprise: {
          title: "Totalentreprise",
          description: "Vi tar det fulle ansvaret fra arkitekttegning til overlevering.",
          fullDetails: "Det ultimate valget for trygghet og enkelhet. Vi koordinerer hele prosjektet ditt fra A til Å. Du har kun én kontrakt, én kontaktperson og full garantiansvar hos oss. Vi ordner alt under ett tak.",
          badge: "Nøkkelferdig",
        },
      },
      quickQuoteTitle: "Trenger du pris på et prosjekt?",
      quickQuoteDesc: "Velg en tjeneste under og få en rask, uforpliktende vurdering eller avtale om gratis befaring.",
      selectService: "Velg tjeneste",
    },
    portfolio: {
      title: "Våre Prosjekter",
      subtitle: "Utforsk et utvalg av våre nylig fullførte prosjekter. Vi legger stolthet i detaljene og leverer alltid kompromissløs kvalitet.",
      filterAll: "Alle",
      filterRenovation: "Totalrenovering",
      filterKitchenBath: "Kjøkken & Bad",
      filterExterior: "Eksteriør & Tilbygg",
      beforeAfterTitle: "Interaktiv Før & Etter Sammenligning",
      beforeLabel: "Før renovering",
      afterLabel: "Etter renovering",
      dragSliderHint: "Dra skyveren for å se forskjellen",
      projectCompleted: "Fullført",
      size: "Størrelse",
      duration: "Varighet",
    },
    process: {
      title: "Vår Arbeidsprosess",
      subtitle: "Vi gjør veien fra idé til ferdig resultat så ryddig, enkel og forutsigbar som mulig for deg.",
      step1Title: "1. Gratis befaring",
      step1Desc: "Vi møtes på stedet for å gå gjennom dine ønsker, vurdere tekniske muligheter og gi faglige råd. Helt uforpliktende.",
      step2Title: "2. Planlegging & Tilbud",
      step2Desc: "Du mottar et detaljert, skriftlig tilbud med fastpris og en tydelig fremdriftsplan. Ingen skjulte kostnader.",
      step3Title: "3. Profesjonell utførelse",
      step3Desc: "Våre dyktige håndverkere utfører arbeidet med presisjon. Prosjektleder koordinerer alt og holder deg løpende oppdatert.",
      step4Title: "4. Overlevering & Garanti",
      step4Desc: "Vi går sluttbefaring sammen. Du mottar alt av ferdigdokumentasjon og garantier i Boligmappa. Velkommen hjem!",
    },
    testimonials: {
      title: "Hva våre kunder sier",
      subtitle: "Vårt mål er 100% fornøyde kunder. Les tilbakemeldingene fra noen av de som har valgt oss som sin prosjektpartner.",
      ratingText: "5.0 av 5 stjerner på Google",
      badgeTitle: "Mesterbedrift & Sentralt Godkjent",
    },
    recruitment: {
      title: "Jobb hos Amiri Bygg",
      subtitle: "Vil du være med å skape eksepsjonelle hjem? Vi søker alltid stolte, dyktige og pålitelige håndverkere til vårt lag.",
      whyJoinUs: "Hvorfor jobbe hos oss?",
      cultureTitle: "Vår bedriftskultur",
      cultureDesc: "I Amiri Bygg verdsetter vi lagånd, profesjonalitet og godt humør. Vi tror at håndverkere som trives og har det riktige verktøyet, leverer de beste resultatene.",
      benefitTitle1: "Førsteklasses utstyr & biler",
      benefitDesc1: "Vi utruster våre tømrere med moderne verktøy fra ledende merker og nye, velutstyrte servicebiler.",
      benefitTitle2: "Konkurransedyktige betingelser",
      benefitDesc2: "Vi tilbyr lønn over tariff, gode pensjons- og forsikringsordninger, samt faste sosiale arrangementer.",
      benefitTitle3: "Utvikling & kursing",
      benefitDesc3: "Vi sponser videreutdanning, mesterbrev og relevante sertifiseringer som våtromskurs og varmearbeider-sertifikat.",
      openPositions: "Ledige stillinger",
      formTitle: "Send en åpen søknad",
      formDesc: "Fyll ut skjemaet under og fortell litt om din erfaring. Vi behandler alle søknader konfidensielt og svarer raskt.",
      fieldName: "Fullt navn",
      fieldEmail: "E-postadresse",
      fieldPhone: "Telefonnummer",
      fieldPosition: "Ønsket stilling",
      fieldExperience: "Erfaring (antall år)",
      fieldMessage: "Kort om deg selv",
      fieldResume: "Last opp CV / Fagbrev",
      dragDropResume: "Dra og slipp filen her, eller klikk for å velge",
      submitApplication: "Send søknad",
      successTitle: "Søknad mottatt!",
      successMessage: "Tusen takk for din interesse for Amiri Bygg. Vi vil gå gjennom din CV og ta kontakt med deg i løpet av få dager.",
    },
    about: {
      title: "Om Amiri Bygg",
      subtitle: "Solid håndverk, skandinavisk kvalitet og trygghet i alle ledd.",
      p1: "Amiri Bygg ble etablert med en visjon om å redefinere hvordan renoverings- og byggeprosjekter gjennomføres i Norge. Vi erfarte at mange kunder syntes det var stressende og uoversiktlig å forholde seg til mange ulike håndverksfirmaer. Derfor spesialiserte vi oss på totalentrepriser.",
      p2: "Når du velger Amiri Bygg, får du én kontaktperson, én kontrakt og et komplett team som jobber mot samme mål: Å levere et resultat av kompromissløs kvalitet som varer i generasjoner. Vi koordinerer arkitekter, søknadsprosesser, tømrere, elektrikere, rørleggere og flisleggere sømløst.",
      p3: "Vi holder til i Oslo/Viken og tar på oss oppdrag for både private boligeiere og bedrifter. Vårt verdigrunnlag er bygget på ærlighet, yrkesstolthet og ryddig kommunikasjon.",
      badgeQuality: "Utsøkt presisjon",
      badgeReliability: "100% pålitelig",
      badgeEco: "Svanemerkede materialer",
    },
    faq: {
      title: "Ofte stilte spørsmål",
      subtitle: "Her finner du svar på de vanligste spørsmålene vi får om planlegging, priser og gjennomføring av byggeprosjekter.",
      q1: "Hvor mye koster det å totalrenovere et bad eller en bolig?",
      a1: "Prisen på totalrenovering avhenger av boligens størrelse, materialvalg og teknisk tilstand. Et standard bad ligger ofte mellom 250 000 og 450 000 kr inkludert alt av arbeid og dokumentasjon. For totalrenovering av hus ligger kvadratmeterprisen gjerne mellom 10 000 og 25 000 kr. Vi gir alltid et detaljert skriftlig fastpristilbud etter befaring slik at du har full forutsigbarhet.",
      q2: "Hvor lang tid tar et renoveringsprosjekt?",
      a2: "Et standard bad tar normalt 3 til 4 uker fra riving til overlevering. Totalrenovering av en hel leilighet tar typisk 6 til 10 uker, mens et helt hus kan ta 3 til 5 måneder avhengig av omfang. Vi utarbeider en detaljert fremdriftsplan med milepæler som vi følger slavisk, og holder deg oppdatert ukentlig.",
      q3: "Må jeg søke kommunen for å bygge et tilbygg eller endre fasaden?",
      a3: "Mindre tilbygg under 15 kvm eller terrasser som ikke overskrider visse høyder krever ofte ikke søknad, så lenge de er i tråd med reguleringsplanen. Større tilbygg, påbygg eller vesentlige fasadeendringer er søknadspliktige. Amiri Bygg hjelper deg med hele søknadsprosessen, nabovarsling og dialog med plan- og bygningsetaten.",
      q4: "Hva slags garantier gir Amiri Bygg på arbeidet?",
      a4: "Vi følger norsk standard (Bustadoppføringslova og Avhendingslova) og gir 5 års reklamasjonsrett på alt utført arbeid. På baderom og våtrom leverer vi full dokumentasjon og tetthetsgaranti som registreres direkte i Boligmappa.no, noe som sikrer boligens verdi ved et eventuelt salg.",
      q5: "Koordinerer dere rørleggere, elektrikere og andre fagfelt?",
      a5: "Ja! Dette er vår største styrke. Vi påtar oss totalentreprisen, noe som betyr at vi koordinerer alle godkjente og forsikrede underleverandører (rørlegger, elektriker, blikkenslager, murer). Du trenger kun å forholde deg til én fast prosjektleder hos oss.",
    },
    contact: {
      title: "La oss diskutere ditt prosjekt",
      subtitle: "Klar for å realisere boligdrømmen? Ta kontakt for en hyggelig og helt uforpliktende prat, eller avtal gratis befaring i dag.",
      formTitle: "Send forespørsel om befaring / tilbud",
      formDesc: "Fyll ut skjemaet under, så kontakter vår prosjektleder deg innen 24 timer for å avtale veien videre.",
      fieldName: "Ditt navn",
      fieldEmail: "E-postadresse",
      fieldPhone: "Telefonnummer",
      fieldService: "Hva gjelder prosjektet?",
      fieldBudget: "Antatt budsjettklasse (valgfritt)",
      fieldMessage: "Beskriv prosjektet og dine ønsker",
      fieldFiles: "Last opp tegninger, bilder eller skisser (valgfritt)",
      submitButton: "Send forespørsel",
      promiseTitle: "Vårt løfte til deg",
      promiseText: "Vi svarer på alle henvendelser innen 24 timer på hverdager. Våre befaringer er alltid 100% gratis og uforpliktende i hele Oslo og Viken.",
      phoneText: "Telefon (08:00 - 18:00)",
      emailText: "E-post (Svarer raskt)",
      officeText: "Hovedkontor",
      successTitle: "Henvendelse sendt!",
      successMessage: "Tusen takk for din henvendelse. En av våre erfarne prosjektledere vil ringe eller sende deg en e-post innen 24 timer for å avtale befaring.",
    },
  },
  en: {
    nav: {
      services: "Services",
      portfolio: "Projects",
      process: "Our Process",
      careers: "Careers",
      about: "About Us",
      faq: "FAQ",
      contact: "Contact",
      admin: "Admin",
      requestQuote: "Get Free Quote",
      callUs: "Call Us",
    },
    hero: {
      headline: "From idea to turnkey result.",
      subheadline: "We guide you through the entire project – from planning to final handover. One partner. One process. A result you can be proud of.",
      ctaPrimary: "Book Free Inspection",
      ctaSecondary: "View Our Projects",
      trustTitle: "Certified and approved contractor",
      badge1: "Central Approval",
      badge2: "Wetroom Certified",
      badge3: "10-Year Warranty",
      badge4: "Qualified Craftsmen",
    },
    trust: {
      title: "Why choose Amiri Bygg?",
      subtitle: "We combine solid craftsmanship, Scandinavian precision, and organized project management to provide a safe and professional building process.",
      card1Title: "Turnkey Contracting",
      card1Desc: "We take full responsibility for everything from applications and drawings to carpentry, plumbing, electrical, and handover.",
      card2Title: "Reliable Progress",
      card2Desc: "We establish detailed progress schedules and deliver on time. Predictability is our highest priority.",
      card3Title: "Solid Expertise",
      card3Desc: "Our team consists of qualified carpenters and certified partners with extensive experience in the Norwegian market.",
      card4Title: "Quality Warranty",
      card4Desc: "We only use approved quality materials adapted to the Nordic climate, and provide solid warranties on all work.",
      card5Title: "Close Follow-up",
      card5Desc: "You will have a dedicated project manager to communicate with throughout. No misunderstandings, just clear lines.",
      card6Title: "Competitive Pricing",
      card6Desc: "We deliver premium quality at agreed and fair prices, with absolutely no hidden fees or unpleasant surprises.",
      stat1Label: "Completed Projects",
      stat2Label: "Customer Satisfaction",
      stat3Label: "Craftsmen on Team",
      stat4Label: "Liability Insurance",
    },
    services: {
      title: "Our Services",
      subtitle: "We deliver everything from minor refurbishments to large extensions and full turnkey contracts. No job is too big or too small.",
      searchPlaceholder: "Search for a service...",
      allCategories: "All services",
      catConstruction: "Building & Construction",
      catInterior: "Interior & Renovation",
      catManagement: "Project Management & Turnkey",
      items: {
        totalrenovering: {
          title: "Complete Renovation",
          description: "Full modernization of older residential and commercial properties to modern standards.",
          fullDetails: "We transform dated properties into modern dream homes. Our complete renovation covers insulation upgrade, window replacement, new surfaces, piping and electrical installations, as well as complete structural layout changes.",
          badge: "Most popular",
        },
        oppussing: {
          title: "Refurbishment",
          description: "Surface cosmetic updates, painting, plastering, and modernizing of any room.",
          fullDetails: "Does your home need a facelift? We assist with plastering, painting, wallpapering, moulding installations, and general upgrades of your living spaces with focus on high precision and a contemporary finish.",
          badge: "Interior",
        },
        kjokken: {
          title: "Kitchen Installation",
          description: "Fitting and tailoring modern kitchen solutions with a flawless finish.",
          fullDetails: "The kitchen is the heart of the home. We dismantle the old kitchen, install new plumbing and electrical points, level out walls, assemble cabinets, doors, custom worktops, and integrated appliances with millimeter accuracy.",
          badge: "Specialty",
        },
        bad: {
          title: "Bathroom & Wetroom",
          description: "Building and renovating bathrooms in compliance with the wetroom standard (BVN).",
          fullDetails: "We build secure and highly aesthetic bathrooms designed to last for decades. As a certified wetroom builder, we deliver bathrooms with full compliance documentation in Boligmappa, expert membrane application, tiling, and premium plumbing.",
          badge: "Certified",
        },
        gulv: {
          title: "Flooring Services",
          description: "Installing parquet, laminates, wooden floors, and solid hardwood with trim.",
          fullDetails: "A beautiful floor defines a space. We help you choose the right underlay, level uneven subfloors, and professionally lay parquet, laminate, luxury click vinyl, or solid wood with perfectly matched skirting boards.",
          badge: "Interior",
        },
        tak: {
          title: "Roofing",
          description: "Renovation, repair, and laying of new roof tiles and roofing shingles.",
          fullDetails: "Secure your home against the element. We perform complete roof replacements, change battens and sub-roofing, install new concrete/clay tiles or shingles, and fit premium gutters and downspouts.",
          badge: "Exterior",
        },
        vegger: {
          title: "Walls & Drywall",
          description: "Erecting partition walls, insulating, dry-walling, and plastering.",
          fullDetails: "Change your floor plan with sturdy, soundproof partition walls. We install drywall, tape, and plaster to perfection for a completely smooth, paint-ready surface.",
          badge: "Interior",
        },
        innvendig: {
          title: "Interior Woodwork",
          description: "Carpentry, mouldings, door installations, and bespoke room solutions.",
          fullDetails: "Complete interior carpentry. Installation of internal doors, sliding doors, windows, trims, ceiling and floor mouldings, as well as custom built-in wardrobes and staircase trim.",
          badge: "Interior",
        },
        utvendig: {
          title: "Exterior Carpentry",
          description: "Replacing wooden cladding, windows, retro-insulation, and custom trim.",
          fullDetails: "Protect and upgrade your home's exterior. We replace rot-damaged or outdated cladding, install modern energy-saving windows, retro-fit high-grade insulation, and finish with beautiful architectural trim.",
          badge: "Exterior",
        },
        tilbygg: {
          title: "Home Extensions",
          description: "Expanding your living space with new rooms, entrance areas, or additional floors.",
          fullDetails: "Need more space for your growing family? We build seamless extensions and additions that blend beautifully with your existing architecture. We also assist with architectural drawings and municipal applications.",
          badge: "Premium",
        },
        rehabilitering: {
          title: "Building Restoration",
          description: "Gentle upgrading and preservation of historic or heritage wooden properties.",
          fullDetails: "We possess specialized expertise in restoring historic wooden buildings and traditional townhouses, keeping their architectural character intact while upgrading insulation and technical standards.",
          badge: "Specialty",
        },
        fasade: {
          title: "Facade Upgrades",
          description: "Modernizing outer walls with high-grade insulation, premium siding, and style.",
          fullDetails: "Give your home a contemporary look and a lower energy bill. We insulate exterior walls, install premium cladding (such as cedar, larch, thermo-ash, or classic timber), and elevate your facade's aesthetic appeal.",
          badge: "Exterior",
        },
        terrasse: {
          title: "Terrace & Outdoor",
          description: "Building custom-designed wooden decks, patios, and privacy fences.",
          fullDetails: "We design and build premium decks and outdoor spaces tailored to your property's terrain. We use everything from pressure-treated pine to luxury composite, Siberian larch, and thermo-ash, complete with custom railings and integrated lighting.",
          badge: "Outdoor",
        },
        prosjektledelse: {
          title: "Project Management",
          description: "Professional coordination of all construction trades, permits, and timelines.",
          fullDetails: "Eliminate the stress of coordinating various subcontractors. Our experienced project managers control the timeline, oversee plumbers, electricians, carpenters, and painters, and ensure all work is documented properly.",
          badge: "Management",
        },
        totalentreprise: {
          title: "Turnkey Contracting",
          description: "We assume complete accountability from architectural blueprints to handover.",
          fullDetails: "The ultimate choice for convenience and peace of mind. We coordinate your entire project from A to Z. You sign only one contract, deal with one contact person, and hold us fully responsible for the warranty. We manage it all.",
          badge: "Turnkey",
        },
      },
      quickQuoteTitle: "Need pricing for a project?",
      quickQuoteDesc: "Select a service below to get a quick, non-binding assessment or to book a free inspection.",
      selectService: "Select service",
    },
    portfolio: {
      title: "Our Projects",
      subtitle: "Explore a selection of our recently completed projects. We take pride in the finer details and always deliver uncompromising quality.",
      filterAll: "All",
      filterRenovation: "Full Renovation",
      filterKitchenBath: "Kitchen & Bath",
      filterExterior: "Exterior & Extension",
      beforeAfterTitle: "Interactive Before & After Comparison",
      beforeLabel: "Before renovation",
      afterLabel: "After renovation",
      dragSliderHint: "Drag the slider to compare",
      projectCompleted: "Completed",
      size: "Size",
      duration: "Duration",
    },
    process: {
      title: "Our Work Process",
      subtitle: "We make the journey from concept to turnkey handover as structured, simple, and predictable as possible.",
      step1Title: "1. Free Inspection",
      step1Desc: "We meet on-site to review your ideas, evaluate technical requirements, and offer professional advice. Completely free of charge.",
      step2Title: "2. Planning & Quote",
      step2Desc: "You receive a detailed, written quote with fixed pricing and a clear progress schedule. No hidden costs, absolute transparency.",
      step3Title: "3. Professional Execution",
      step3Desc: "Our skilled craftsmen carry out the work with high precision. Your project manager coordinates all trades and provides regular updates.",
      step4Title: "4. Handover & Warranty",
      step4Desc: "We conduct a final walkthrough together. You receive all compliance documentation and warranties logged directly in Boligmappa.no.",
    },
    testimonials: {
      title: "What our clients say",
      subtitle: "Our goal is 100% customer satisfaction. Read feedback from some of those who chose us as their trusted project partner.",
      ratingText: "5.0 out of 5 stars on Google",
      badgeTitle: "Master Builder & Centrally Approved",
    },
    recruitment: {
      title: "Careers at Amiri Bygg",
      subtitle: "Do you want to build exceptional homes? We are always looking for proud, skilled, and reliable craftsmen to join our team.",
      whyJoinUs: "Why work with us?",
      cultureTitle: "Our Company Culture",
      cultureDesc: "At Amiri Bygg, we value teamwork, professionalism, and mutual respect. We believe that craftsmen who thrive and are equipped with the best tools deliver the absolute best results.",
      benefitTitle1: "First-Class Equipment & Vans",
      benefitDesc1: "We equip our carpenters with modern premium tools from leading brands and new, fully organized service vehicles.",
      benefitTitle2: "Highly Competitive Terms",
      benefitDesc2: "We offer wages above standard rates, solid pension and insurance schemes, and regular corporate social gatherings.",
      benefitTitle3: "Training & Development",
      benefitDesc3: "We sponsor further education, Master Builder programs, and relevant certifications like wetroom courses and safety permits.",
      openPositions: "Open Positions",
      formTitle: "Submit an Open Application",
      formDesc: "Fill out the form below and tell us about your experience. We handle all applications confidentially and reply quickly.",
      fieldName: "Full Name",
      fieldEmail: "Email Address",
      fieldPhone: "Phone Number",
      fieldPosition: "Desired Role",
      fieldExperience: "Experience (years)",
      fieldMessage: "Briefly about yourself",
      fieldResume: "Upload CV / Credentials",
      dragDropResume: "Drag and drop your file here, or click to browse",
      submitApplication: "Submit Application",
      successTitle: "Application Received!",
      successMessage: "Thank you so much for your interest in Amiri Bygg. We will review your CV and contact you within a few business days.",
    },
    about: {
      title: "About Amiri Bygg",
      subtitle: "Solid craftsmanship, Scandinavian quality, and security in every detail.",
      p1: "Amiri Bygg was established with a vision to redefine how renovation and construction projects are executed in Norway. We noticed that customers found it highly stressful to coordinate multiple independent trade companies. This inspired us to specialize in full turnkey services.",
      p2: "When you choose Amiri Bygg, you get one dedicated project manager, one consolidated contract, and a highly skilled team working towards a single goal: delivering a result of uncompromising quality that lasts for generations. We seamlessly coordinate architects, planning permits, carpenters, electricians, plumbers, and tilers.",
      p3: "Based in Oslo/Viken, we execute projects for both private homeowners and commercial clients. Our core values are honesty, professional pride, and clear communication.",
      badgeQuality: "Exquisite Precision",
      badgeReliability: "100% Reliable",
      badgeEco: "Eco-Friendly Materials",
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to the most common questions regarding planning, pricing, and project completion.",
      q1: "How much does it cost to completely renovate a bathroom or house?",
      a1: "The price of a complete renovation depends on the property's size, material selections, and current technical condition. A standard bathroom renovation typically ranges from NOK 250,000 to 450,000 including all labor, materials, and compliance documents. For full house renovations, square meter pricing typically lands between NOK 10,000 and 25,000. We always provide a detailed, written fixed-price quote after inspection to ensure absolute transparency.",
      q2: "How long does a renovation project take?",
      a2: "A standard bathroom normally takes 3 to 4 weeks from demolition to final handover. Renovating a complete apartment typically takes 6 to 10 weeks, while an entire house can take 3 to 5 months depending on scope. We prepare a detailed progress schedule with clear milestones that we follow meticulously, updating you weekly.",
      q3: "Do I need to apply to the municipality for an extension or facade change?",
      a3: "Small extensions under 15 sqm or terraces under certain height limits often do not require municipal approval, provided they comply with local zoning regulations. Larger extensions, second-story additions, or major facade changes require formal building permits. Amiri Bygg manages the entire application process, neighbor notifications, and dialogue with planning departments.",
      q4: "What warranties does Amiri Bygg provide on the work?",
      a4: "We strictly follow Norwegian standard (Bustadoppføringslova and Avhendingslova) providing a 5-year warranty on all executed services. For bathrooms and wetrooms, we deliver complete compliance documentation and waterproof membrane warranties registered directly in Boligmappa.no, securing your home's resale value.",
      q5: "Do you coordinate plumbers, electricians, and other trades?",
      a5: "Yes! This is our core strength. We assume the full turnkey contract, which means we coordinate all certified and insured subcontractors (plumbers, electricians, tinsmiths, bricklayers). You only ever need to deal with your single, dedicated project manager.",
    },
    contact: {
      title: "Let's Discuss Your Project",
      subtitle: "Ready to realize your dream home? Get in touch for a friendly, no-obligation conversation, or book your free inspection today.",
      formTitle: "Send Inspection or Quote Inquiry",
      formDesc: "Fill out the form below, and our project manager will get back to you within 24 hours to schedule the next step.",
      fieldName: "Your Name",
      fieldEmail: "Email Address",
      fieldPhone: "Phone Number",
      fieldService: "What does the project involve?",
      fieldBudget: "Estimated Budget Range (optional)",
      fieldMessage: "Describe your project and key wishes",
      fieldFiles: "Upload drawings, photos, or sketches (optional)",
      submitButton: "Send Inquiry",
      promiseTitle: "Our Promise to You",
      promiseText: "We reply to all inquiries within 24 hours on business days. Our inspections are always 100% free and non-binding throughout Oslo and Viken.",
      phoneText: "Phone (08:00 - 18:00)",
      emailText: "Email (Fast replies)",
      officeText: "Headquarters",
      successTitle: "Inquiry Sent Successfully!",
      successMessage: "Thank you so much for contacting us. One of our experienced project managers will call or email you within 24 hours to arrange your free inspection.",
    },
  },
};
