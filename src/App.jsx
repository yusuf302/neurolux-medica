import { useEffect, useMemo, useState } from "react";

const LANG_STORAGE_KEY = "neurolux-language";

const copy = {
  en: {
    languageLabel: "Choose language",
    brand: "NeuroLux Medica",
    mark: "NL",
    heroTitle: "Patient-access infrastructure for clinics that cannot afford to lose demand.",
    heroBody:
      "A complete prototype of the AI receptionist, verified appointment workflow, recovery engine, escalation queue, and management dashboard that turns patient interest into measurable care activity.",
    proof: [
      ["Average first reply", "8 sec"],
      ["Weekly recovered demand", "34 patients"],
      ["Mock value influenced", "TZS 18.6M"],
    ],
    safetyBoundary: {
      title: "Safe HPI intake only",
      body: "This prototype collects access and intake information only. It does not provide diagnosis or treatment advice.",
    },
    modesAria: "Demo modes",
    modes: {
      book: {
        label: "Book a patient",
        intent: "New patient asks for care and wants the earliest useful appointment.",
        headline: "Inquiry converted into a confirmed visit",
        outcome: "Booked",
        accent: "blue",
      },
      recover: {
        label: "Recover missed demand",
        intent: "Patient started booking, disappeared, then replies to a recovery prompt.",
        headline: "Abandoned demand recovered before it is lost",
        outcome: "Recovered",
        accent: "green",
      },
      escalate: {
        label: "Escalate safely",
        intent: "Patient message includes risk or uncertainty that should not be handled by automation.",
        headline: "Automation stops and routes to clinical staff",
        outcome: "Escalated",
        accent: "amber",
      },
      manager: {
        label: "Manager view",
        intent: "Leadership wants proof that access workflows are improving conversion.",
        headline: "Management sees the value created",
        outcome: "Measured",
        accent: "violet",
      },
    },
    services: {
      cardiology: {
        name: "Cardiology",
        fullName: "Cardiology consultation",
        doctor: "Dr. Asha Mwinyi",
        branch: "Oysterbay Specialist Centre",
        price: "TZS 85,000",
        slot: "Tomorrow, 10:30",
        downstream: "ECG and lab referral readiness",
      },
      diagnostics: {
        name: "Diagnostics",
        fullName: "Ultrasound scan",
        doctor: "Diagnostics team",
        branch: "Masaki Imaging Wing",
        price: "TZS 120,000",
        slot: "Today, 15:20",
        downstream: "Radiology report follow-up",
      },
      dental: {
        name: "Dental",
        fullName: "Dental treatment",
        doctor: "Dr. Neema Joseph",
        branch: "City Dental Suite",
        price: "From TZS 60,000",
        slot: "Today, 11:15",
        downstream: "Treatment-plan conversion",
      },
      pediatrics: {
        name: "Pediatrics",
        fullName: "Pediatric clinic",
        doctor: "Dr. Baraka Mushi",
        branch: "Mikocheni Family Wing",
        price: "TZS 70,000",
        slot: "Tomorrow, 09:10",
        downstream: "Immunization and follow-up recall",
      },
    },
    stages: ["Capture", "HPI intake", "Verify service", "Book or escalate", "Follow up", "Measure"],
    hpi: {
      eyebrow: "Structured HPI",
      title: "History of Presenting Illness",
      complete: "Captured",
      waiting: "Waiting",
      note: "The system stops after these intake fields and hands risk to staff.",
      items: [
        ["Duration", "How long has this been happening?", "3 days"],
        ["Onset", "Did it start suddenly or gradually?", "Started gradually"],
        ["Nature", "How would you describe what you are feeling?", "Intermittent discomfort"],
        ["Periodicity", "Does it come and go, or is it constant?", "Comes and goes"],
        ["Associated factors", "Is there anything else happening with it?", "Mild fatigue"],
        ["Relieving factors", "What seems to make it better?", "Resting helps a little"],
        ["Aggravating factors", "What seems to make it worse?", "Worse after exertion"],
      ],
    },
    controls: {
      eyebrow: "Demo builder",
      title: "Shape the clinic case",
      service: "Service line",
      risk: "Patient risk",
      branch: "Deployment branch",
      run: "Run next workflow step",
      riskOptions: {
        normal: "Routine access request",
        "same-day": "Same-day pressure",
        "clinical-risk": "Clinical-risk wording",
        "low-confidence": "Unclear request",
      },
      branches: {
        primary: "Primary clinic branch",
        specialist: "Specialist wing",
        diagnostic: "Diagnostics center",
      },
    },
    conversation: {
      eyebrow: "AI receptionist",
      title: "Verified patient conversation",
      ready: "Ready to book",
      review: "Human review required",
      speakers: {
        patient: "Patient",
        neurolux: "NeuroLux",
        clinical: "Clinical desk",
        operations: "Operations lead",
      },
    },
    workflow: {
      eyebrow: "Clinic workflow",
      title: "From inquiry to measurable outcome",
      step: "Step",
      of: "of",
      complete: "Complete",
      waiting: "Waiting",
    },
    appointment: {
      eyebrow: "Appointment engine",
      paused: "Paused for safety",
      clinician: "Clinician",
      slot: "Slot",
      branch: "Branch",
      price: "Approved price",
      immediate: "Immediate callback",
      staffConfirms: "Staff confirms",
      clinicalDesk: "Clinical desk",
      truth: "Truth comes from approved clinic data, not model memory.",
    },
    dashboard: {
      eyebrow: "Executive dashboard",
      title: "Impact snapshot",
      inquiries: "Inquiries",
      bookings: "Bookings",
      recovered: "Recovered",
      attendance: "Attendance",
      revenue: "Revenue influenced",
      disclaimer: "Mock estimate for demo only",
      trust: "Trust protected",
    },
    safety: {
      eyebrow: "Safety center",
      activeTitle: "Escalation active",
      normalTitle: "Exceptions monitored",
      active:
        "Clinical-risk or low-confidence language detected. Automation stops, staff are alerted, and the patient receives safe routing.",
      normal: "Routine case. Staff only see exceptions, insurance checks, and follow-up needs.",
    },
    messages: {
      riskPatient: (service) =>
        `I need help with ${service.fullName.toLowerCase()}, but I also have chest pain and trouble breathing.`,
      riskSystem:
        "I cannot assess symptoms or give medical advice in this chat. I am alerting the clinic team now so a qualified staff member can review and call back according to clinic policy.",
      riskClinical: (service) =>
        `High-priority case opened for ${service.branch}. Staff receive the patient request, service context, and callback need.`,
      recoverPatient: (service) => `I started booking ${service.fullName.toLowerCase()} but did not finish.`,
      recoverSystem: (service) =>
        `I saved the completed intake summary. The ${service.slot} slot is still available at ${service.branch}. Would you like me to reserve it?`,
      recoverPatientYes: "Yes, please reserve it.",
      recoverConfirm: (service) =>
        `Confirmed with ${service.doctor}. A reminder is scheduled, and this is marked as recovered demand.`,
      managerLead: "Show me where patient demand is leaking this week.",
      managerInsight: "Most leakage is happening after inquiry qualification and before appointment confirmation.",
      managerOpportunity: (service) =>
        `${service.fullName} has the strongest recovery opportunity because ${service.downstream.toLowerCase()} can be triggered after booking.`,
      bookPatient: (service) => `Hi, do you have ${service.fullName.toLowerCase()} available soon?`,
      bookSystem: (service) =>
        `Yes. Before booking, I will capture a short HPI intake only: duration, onset, nature, periodicity, associated factors, relieving factors, and aggravating factors.`,
      bookPatientAsk: "I have answered the intake questions. Can you book the visit and send the details?",
      bookConfirm: (service) =>
        `Booked. The approved price is ${service.price}. Confirmation, location, and reminder are ready.`,
    },
  },
  sw: {
    languageLabel: "Chagua lugha",
    brand: "NeuroLux Medica",
    mark: "NL",
    heroTitle: "Miundombinu ya upatikanaji wa huduma kwa kliniki zisizopaswa kupoteza mahitaji ya wagonjwa.",
    heroBody:
      "Mfano kamili wa mpokezi wa kidijitali, mtiririko uliothibitishwa wa miadi, urejeshaji wa wagonjwa waliokwama, rufaa kwa wahudumu, na dashibodi ya uongozi inayogeuza nia ya mgonjwa kuwa shughuli ya huduma inayopimika.",
    proof: [
      ["Muda wa jibu la kwanza", "sek 8"],
      ["Mahitaji yaliyorejeshwa kwa wiki", "wagonjwa 34"],
      ["Thamani ya mfano iliyoathiriwa", "TZS 18.6M"],
    ],
    safetyBoundary: {
      title: "HPI salama pekee",
      body: "Mfumo huu unakusanya taarifa za awali na miadi pekee. Hautoi utambuzi wala mpango wa matibabu.",
    },
    modesAria: "Njia za onyesho",
    modes: {
      book: {
        label: "Mweke mgonjwa kwenye miadi",
        intent: "Mgonjwa mpya anaulizia huduma na anataka muda wa karibu unaofaa.",
        headline: "Swali limegeuzwa kuwa ziara iliyothibitishwa",
        outcome: "Amewekewa",
        accent: "blue",
      },
      recover: {
        label: "Rejesha mahitaji yaliyopotea",
        intent: "Mgonjwa alianza kuweka miadi, akaacha, kisha akajibu ujumbe wa kumrudisha.",
        headline: "Mahitaji yaliyokwama yamerejeshwa kabla hayajapotea",
        outcome: "Yamerejeshwa",
        accent: "green",
      },
      escalate: {
        label: "Pandisha kwa usalama",
        intent: "Ujumbe wa mgonjwa una hatari au kutokuwa wazi kunakohitaji mhudumu wa kliniki.",
        headline: "Mfumo unasimama na kumpeleka mgonjwa kwa wahudumu",
        outcome: "Imepandishwa",
        accent: "amber",
      },
      manager: {
        label: "Mwonekano wa meneja",
        intent: "Uongozi unataka ushahidi kuwa mtiririko wa upatikanaji unaongeza ubadilishaji.",
        headline: "Uongozi unaona thamani iliyotengenezwa",
        outcome: "Imepimwa",
        accent: "violet",
      },
    },
    services: {
      cardiology: {
        name: "Moyo",
        fullName: "Ushauri wa moyo",
        doctor: "Dr. Asha Mwinyi",
        branch: "Oysterbay Specialist Centre",
        price: "TZS 85,000",
        slot: "Kesho, 10:30",
        downstream: "utayari wa ECG na rufaa ya vipimo",
      },
      diagnostics: {
        name: "Vipimo",
        fullName: "Kipimo cha ultrasound",
        doctor: "Timu ya vipimo",
        branch: "Masaki Imaging Wing",
        price: "TZS 120,000",
        slot: "Leo, 15:20",
        downstream: "ufuatiliaji wa ripoti ya radiolojia",
      },
      dental: {
        name: "Meno",
        fullName: "Huduma ya meno",
        doctor: "Dr. Neema Joseph",
        branch: "City Dental Suite",
        price: "Kuanzia TZS 60,000",
        slot: "Leo, 11:15",
        downstream: "ubadilishaji wa mpango wa matibabu",
      },
      pediatrics: {
        name: "Watoto",
        fullName: "Kliniki ya watoto",
        doctor: "Dr. Baraka Mushi",
        branch: "Mikocheni Family Wing",
        price: "TZS 70,000",
        slot: "Kesho, 09:10",
        downstream: "chanjo na ukumbusho wa ufuatiliaji",
      },
    },
    stages: ["Pokea", "HPI ya awali", "Thibitisha huduma", "Weka miadi au pandisha", "Fuatilia", "Pima"],
    hpi: {
      eyebrow: "HPI iliyopangwa",
      title: "Historia ya ugonjwa uliopo",
      complete: "Imekusanywa",
      waiting: "Inasubiri",
      note: "Mfumo unasimama baada ya taarifa hizi na kupeleka hatari kwa wahudumu.",
      items: [
        ["Muda", "Hali hii imekuwepo kwa muda gani?", "Siku 3"],
        ["Mwanzo", "Ilianza ghafla au taratibu?", "Ilianza taratibu"],
        ["Aina", "Unaweza kueleza unachohisi kwa namna gani?", "Usumbufu unaokuja na kuondoka"],
        ["Muendelezo", "Inakuja na kuondoka au ipo muda wote?", "Inakuja na kuondoka"],
        ["Mambo yanayoambatana", "Kuna jambo jingine linaloambatana nayo?", "Uchovu kidogo"],
        ["Yanayopunguza", "Nini kinaonekana kupunguza hali hiyo?", "Kupumzika kunasaidia kidogo"],
        ["Yanayoongeza", "Nini kinaonekana kuongeza hali hiyo?", "Inaongezeka baada ya kujitahidi"],
      ],
    },
    controls: {
      eyebrow: "Kijenzi cha onyesho",
      title: "Tengeneza kesi ya kliniki",
      service: "Aina ya huduma",
      risk: "Hatari ya mgonjwa",
      branch: "Tawi la utekelezaji",
      run: "Endesha hatua inayofuata",
      riskOptions: {
        normal: "Ombi la kawaida la huduma",
        "same-day": "Uhitaji wa siku hiyo hiyo",
        "clinical-risk": "Maneno yenye hatari ya kitabibu",
        "low-confidence": "Ombi lisilo wazi",
      },
      branches: {
        primary: "Tawi kuu la kliniki",
        specialist: "Kitengo cha bingwa",
        diagnostic: "Kituo cha vipimo",
      },
    },
    conversation: {
      eyebrow: "Mpokezi wa kidijitali",
      title: "Mazungumzo ya mgonjwa yaliyothibitishwa",
      ready: "Tayari kuweka miadi",
      review: "Inahitaji mapitio ya mfanyakazi",
      speakers: {
        patient: "Mgonjwa",
        neurolux: "NeuroLux",
        clinical: "Dawati la kliniki",
        operations: "Kiongozi wa uendeshaji",
      },
    },
    workflow: {
      eyebrow: "Mtiririko wa kliniki",
      title: "Kutoka swali la mgonjwa hadi matokeo yanayopimika",
      step: "Hatua",
      of: "kati ya",
      complete: "Imekamilika",
      waiting: "Inasubiri",
    },
    appointment: {
      eyebrow: "Injini ya miadi",
      paused: "Imesitishwa kwa usalama",
      clinician: "Mhudumu",
      slot: "Muda",
      branch: "Tawi",
      price: "Bei iliyoidhinishwa",
      immediate: "Simu ya haraka",
      staffConfirms: "Mfanyakazi athibitishe",
      clinicalDesk: "Dawati la kliniki",
      truth: "Taarifa hutoka kwenye data iliyoidhinishwa ya kliniki, si kumbukumbu ya mfumo.",
    },
    dashboard: {
      eyebrow: "Dashibodi ya uongozi",
      title: "Muhtasari wa matokeo",
      inquiries: "Maulizo",
      bookings: "Miadi",
      recovered: "Waliorejeshwa",
      attendance: "Mahudhurio",
      revenue: "Mapato yaliyoathiriwa",
      disclaimer: "Makadirio ya mfano kwa onyesho pekee",
      trust: "Uaminifu umelindwa",
    },
    safety: {
      eyebrow: "Kituo cha usalama",
      activeTitle: "Rufaa kwa wahudumu imewashwa",
      normalTitle: "Mambo yasiyo ya kawaida yanafuatiliwa",
      active:
        "Maneno yenye hatari ya kitabibu au ombi lisilo wazi yameonekana. Mfumo unasimama, wahudumu wanaarifiwa, na mgonjwa anapewa njia salama ya huduma.",
      normal: "Kesi ya kawaida. Wahudumu wanaona tu mambo maalum, ukaguzi wa bima, na mahitaji ya ufuatiliaji.",
    },
    messages: {
      riskPatient: (service) =>
        `Nahitaji msaada kuhusu ${service.fullName.toLowerCase()}, lakini pia nina maumivu ya kifua na shida ya kupumua.`,
      riskSystem:
        "Siwezi kutathmini dalili wala kutoa ushauri wa matibabu kwenye mazungumzo haya. Ninaiarifu timu ya kliniki sasa ili mhudumu mwenye sifa akague na kupiga simu kulingana na sera ya kliniki.",
      riskClinical: (service) =>
        `Kesi ya kipaumbele imefunguliwa kwa ${service.branch}. Wahudumu wanapokea ombi la mgonjwa, muktadha wa huduma, na hitaji la kumpigia simu.`,
      recoverPatient: (service) => `Nilianza kuweka miadi ya ${service.fullName.toLowerCase()} lakini sikumaliza.`,
      recoverSystem: (service) =>
        `Nimehifadhi muhtasari wa taarifa za awali. Muda wa ${service.slot} bado upo ${service.branch}. Ungependa niuhifadhi kwa ajili yako?`,
      recoverPatientYes: "Ndiyo, tafadhali uhifadhi.",
      recoverConfirm: (service) =>
        `Imethibitishwa na ${service.doctor}. Ukumbusho umepangwa, na kesi hii imewekwa kama mahitaji yaliyorejeshwa.`,
      managerLead: "Nionyeshe sehemu mahitaji ya wagonjwa yanapopotea wiki hii.",
      managerInsight: "Upotevu mkubwa unatokea baada ya kuelewa ombi na kabla ya kuthibitisha miadi.",
      managerOpportunity: (service) =>
        `${service.fullName} ina nafasi kubwa ya kurejesha wagonjwa kwa sababu ${service.downstream} kinaweza kuanzishwa baada ya miadi.`,
      bookPatient: (service) => `Habari, je ${service.fullName.toLowerCase()} inapatikana hivi karibuni?`,
      bookSystem: (service) =>
        `Ndiyo. Kabla ya kuweka miadi, nitakusanya HPI fupi pekee: muda, mwanzo, aina, muendelezo, mambo yanayoambatana, yanayopunguza, na yanayoongeza.`,
      bookPatientAsk: "Nimejibu maswali ya awali. Unaweza kuniwekea miadi na kunitumia maelezo?",
      bookConfirm: (service) =>
        `Umewekewa miadi. Bei iliyoidhinishwa ni ${service.price}. Uthibitisho, eneo, na ukumbusho viko tayari.`,
    },
  },
};

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(LANG_STORAGE_KEY) || "en";
}

function makeConversation(mode, service, urgency, t) {
  const risky = mode === "escalate" || urgency === "clinical-risk" || urgency === "low-confidence";
  const speakers = t.conversation.speakers;

  if (risky) {
    return [
      [speakers.patient, t.messages.riskPatient(service)],
      [speakers.neurolux, t.messages.riskSystem],
      [speakers.clinical, t.messages.riskClinical(service)],
    ];
  }

  if (mode === "recover") {
    return [
      [speakers.patient, t.messages.recoverPatient(service)],
      [speakers.neurolux, t.messages.recoverSystem(service)],
      [speakers.patient, t.messages.recoverPatientYes],
      [speakers.neurolux, t.messages.recoverConfirm(service)],
    ];
  }

  if (mode === "manager") {
    return [
      [speakers.operations, t.messages.managerLead],
      [speakers.neurolux, t.messages.managerInsight],
      [speakers.neurolux, t.messages.managerOpportunity(service)],
    ];
  }

  return [
    [speakers.patient, t.messages.bookPatient(service)],
    [speakers.neurolux, t.messages.bookSystem(service)],
    [speakers.patient, t.messages.bookPatientAsk],
    [speakers.neurolux, t.messages.bookConfirm(service)],
  ];
}

function makeMetrics(mode, trustLabel) {
  if (mode === "recover") return { inquiries: 184, bookings: 58, recovered: 21, attendance: "82%", value: "TZS 7.4M" };
  if (mode === "escalate") return { inquiries: 171, bookings: 49, recovered: 13, attendance: "79%", value: trustLabel };
  if (mode === "manager") return { inquiries: 312, bookings: 96, recovered: 34, attendance: "86%", value: "TZS 18.6M" };
  return { inquiries: 166, bookings: 54, recovered: 12, attendance: "81%", value: "TZS 5.8M" };
}

function speakerClass(speaker, speakers) {
  if (speaker === speakers.patient || speaker === speakers.operations) return "patient";
  if (speaker === speakers.clinical) return "staff";
  return "system";
}

export default function App() {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [mode, setMode] = useState("book");
  const [serviceKey, setServiceKey] = useState("cardiology");
  const [urgency, setUrgency] = useState("normal");
  const [branch, setBranch] = useState("primary");
  const [step, setStep] = useState(3);

  const t = copy[language];
  const service = t.services[serviceKey];
  const selectedMode = t.modes[mode];
  const risky = mode === "escalate" || urgency === "clinical-risk" || urgency === "low-confidence";
  const conversation = useMemo(() => makeConversation(mode, service, urgency, t), [mode, service, urgency, t]);
  const metrics = makeMetrics(mode, t.dashboard.trust);
  const visibleMessages = conversation.slice(0, Math.min(conversation.length, step + 1));
  const hpiCaptured = risky ? 0 : mode === "recover" ? 4 : step >= 3 ? t.hpi.items.length : Math.min(t.hpi.items.length, step + 3);

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, language);
    document.documentElement.lang = language === "sw" ? "sw-TZ" : "en";
  }, [language]);

  function chooseMode(nextMode) {
    setMode(nextMode);
    setUrgency(nextMode === "escalate" ? "clinical-risk" : "normal");
    setStep(nextMode === "recover" || nextMode === "escalate" ? 2 : 3);
  }

  function runNextStep() {
    setStep((current) => (current >= t.stages.length - 1 ? 0 : current + 1));
  }

  return (
    <main className="shell">
      <div className="top-actions">
        <div className="language-switch" aria-label={t.languageLabel}>
          <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} type="button">
            English
          </button>
          <button className={language === "sw" ? "active" : ""} onClick={() => setLanguage("sw")} type="button">
            Kiswahili
          </button>
        </div>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <div className="brand-mark">{t.mark}</div>
          <p className="eyebrow">{t.brand}</p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroBody}</p>
        </div>
        <div className="hero-proof">
          {t.proof.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="mode-bar" aria-label={t.modesAria}>
        {Object.entries(t.modes).map(([key, item]) => (
          <button className={mode === key ? "active" : ""} key={key} onClick={() => chooseMode(key)} type="button">
            <span>{item.label}</span>
            <small>{item.outcome}</small>
          </button>
        ))}
      </section>

      <section className="product-grid">
        <aside className="panel controls">
          <div className="panel-head">
            <p className="eyebrow">{t.controls.eyebrow}</p>
            <h2>{t.controls.title}</h2>
          </div>
          <label>
            {t.controls.service}
            <select value={serviceKey} onChange={(event) => setServiceKey(event.target.value)}>
              {Object.entries(t.services).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.fullName}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.controls.risk}
            <select value={urgency} onChange={(event) => setUrgency(event.target.value)}>
              {Object.entries(t.controls.riskOptions).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.controls.branch}
            <select value={branch} onChange={(event) => setBranch(event.target.value)}>
              {Object.entries(t.controls.branches).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button className="run-button" onClick={runNextStep} type="button">
            {t.controls.run}
          </button>
          <div className="safety-boundary">
            <strong>{t.safetyBoundary.title}</strong>
            <span>{t.safetyBoundary.body}</span>
          </div>
          <div className="mode-intent">
            <strong>{selectedMode.headline}</strong>
            <span>{selectedMode.intent}</span>
          </div>
        </aside>

        <section className="center-stage">
          <article className="panel conversation-card">
            <div className="panel-head row">
              <div>
                <p className="eyebrow">{t.conversation.eyebrow}</p>
                <h2>{t.conversation.title}</h2>
              </div>
              <span className={`status ${selectedMode.accent}`}>{risky ? t.conversation.review : t.conversation.ready}</span>
            </div>
            <div className="phone-frame">
              {visibleMessages.map(([speaker, text], index) => (
                <div className={`bubble ${speakerClass(speaker, t.conversation.speakers)}`} key={`${speaker}-${index}`}>
                  <small>{speaker}</small>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel hpi-card">
            <div className="panel-head row">
              <div>
                <p className="eyebrow">{t.hpi.eyebrow}</p>
                <h2>{t.hpi.title}</h2>
              </div>
              <span className={`status ${risky ? "amber" : "green"}`}>
                {hpiCaptured} / {t.hpi.items.length}
              </span>
            </div>
            <div className="hpi-list">
              {t.hpi.items.map(([label, question, answer], index) => {
                const captured = index < hpiCaptured;
                return (
                  <div className={captured ? "hpi-item captured" : "hpi-item"} key={label}>
                    <span>{captured ? "✓" : index + 1}</span>
                    <div>
                      <strong>{label}</strong>
                      <small>{question}</small>
                      <em>{captured ? answer : t.hpi.waiting}</em>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="hpi-note">{t.hpi.note}</p>
          </article>

          <article className="panel workflow-card">
            <div className="panel-head row">
              <div>
                <p className="eyebrow">{t.workflow.eyebrow}</p>
                <h2>{t.workflow.title}</h2>
              </div>
              <span className="status green">
                {t.workflow.step} {step + 1} {t.workflow.of} {t.stages.length}
              </span>
            </div>
            <div className="workflow-board">
              {t.stages.map((label, index) => (
                <div className={index <= step ? "workflow-step done" : "workflow-step"} key={label}>
                  <span>{index + 1}</span>
                  <strong>{label}</strong>
                  <small>{index <= step ? t.workflow.complete : t.workflow.waiting}</small>
                </div>
              ))}
            </div>
          </article>
        </section>

        <aside className="right-stage">
          <article className="panel appointment">
            <div className="panel-head">
              <p className="eyebrow">{t.appointment.eyebrow}</p>
              <h2>{risky ? t.appointment.paused : service.fullName}</h2>
            </div>
            <dl>
              <div>
                <dt>{t.appointment.clinician}</dt>
                <dd>{risky ? t.appointment.clinicalDesk : service.doctor}</dd>
              </div>
              <div>
                <dt>{t.appointment.slot}</dt>
                <dd>{risky ? t.appointment.immediate : service.slot}</dd>
              </div>
              <div>
                <dt>{t.appointment.branch}</dt>
                <dd>{branch === "primary" ? service.branch : t.controls.branches[branch]}</dd>
              </div>
              <div>
                <dt>{t.appointment.price}</dt>
                <dd>{risky ? t.appointment.staffConfirms : service.price}</dd>
              </div>
            </dl>
            <div className="truth-box">{t.appointment.truth}</div>
          </article>

          <article className="panel dashboard">
            <div className="panel-head">
              <p className="eyebrow">{t.dashboard.eyebrow}</p>
              <h2>{t.dashboard.title}</h2>
            </div>
            <div className="metrics">
              <div>
                <span>{t.dashboard.inquiries}</span>
                <strong>{metrics.inquiries}</strong>
              </div>
              <div>
                <span>{t.dashboard.bookings}</span>
                <strong>{metrics.bookings}</strong>
              </div>
              <div>
                <span>{t.dashboard.recovered}</span>
                <strong>{metrics.recovered}</strong>
              </div>
              <div>
                <span>{t.dashboard.attendance}</span>
                <strong>{metrics.attendance}</strong>
              </div>
            </div>
            <div className="value-card">
              <span>{t.dashboard.revenue}</span>
              <strong>{metrics.value}</strong>
              <small>{t.dashboard.disclaimer}</small>
            </div>
          </article>

          <article className="panel escalation">
            <div className="panel-head">
              <p className="eyebrow">{t.safety.eyebrow}</p>
              <h2>{risky ? t.safety.activeTitle : t.safety.normalTitle}</h2>
            </div>
            <div className={risky ? "alert active" : "alert"}>{risky ? t.safety.active : t.safety.normal}</div>
          </article>
        </aside>
      </section>
    </main>
  );
}
