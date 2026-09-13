import { useEffect, useMemo, useState } from "react";

const LANG_STORAGE_KEY = "neurolux-language";

const translations = {
  en: {
    brand: "NeuroLux Medica",
    chooseLanguage: "Choose language",
    heroTitle: "A patient-access system for Tanzanian clinics, from first message to booked visit.",
    heroBody:
      "This prototype shows how NeuroLux can collect safe intake details, understand booking intent, route risky cases to staff, and give managers a live view of demand, recovery, and clinic capacity.",
    metrics: [
      ["First response", "8 sec"],
      ["Recovered demand", "34 patients"],
      ["Attendance lift", "+17%"],
      ["Mock value", "TZS 18.6M"],
    ],
    roles: {
      patient: "Patient",
      staff: "Staff",
      manager: "Manager",
    },
    modes: {
      book: "Book a patient",
      recover: "Recover missed demand",
      escalate: "Escalate safely",
    },
    modeDescriptions: {
      book: "A patient completes HPI intake and chooses an available clinic slot.",
      recover: "A patient abandons the journey, then returns from a recovery reminder.",
      escalate: "Risk or unclear wording stops automation and sends the case to staff.",
    },
    controls: {
      title: "Live demo controls",
      service: "Service",
      branch: "Clinic branch",
      urgency: "Patient signal",
      next: "Next step",
      back: "Back",
      reset: "Reset demo",
      upload: "Attach history file",
      uploadHelp: "PDF or image preview only. Nothing is uploaded or stored.",
      noFile: "No file attached",
      fileReady: "File ready for preview",
      consent: "Patient confirms this is intake for booking and staff review only.",
    },
    steps: ["Patient details", "Service need", "Safe HPI intake", "History upload", "Appointment slot", "Confirmation"],
    fields: {
      patient: "Patient name",
      phone: "Phone",
      channel: "Preferred channel",
      insurance: "Payment / insurance",
      clinician: "Clinician",
      branch: "Branch",
      slot: "Preferred slot",
      status: "Case status",
    },
    patient: {
      title: "Patient intake",
      subtitle: "Guided form plus chat, designed for phone-first access.",
      name: "Amina Juma",
      phone: "+255 712 456 900",
      channel: "WhatsApp",
      insurance: "Cash / mobile money",
      confirmed: "Booking confirmed",
      waiting: "Waiting for patient",
      recovered: "Recovered from reminder",
      escalated: "Human review required",
    },
    hpi: {
      title: "History of Presenting Illness",
      boundary: "NeuroLux collects only these seven HPI fields. It does not diagnose, advise treatment, or keep asking about sickness beyond this checklist.",
      waiting: "Waiting for response",
      items: [
        ["Duration", "How long has this been happening?", "3 days"],
        ["Onset", "Did it start suddenly or gradually?", "Started gradually"],
        ["Nature", "How would you describe what you are feeling?", "Intermittent discomfort"],
        ["Periodicity", "Does it come and go, or is it constant?", "Comes and goes"],
        ["Associated factors", "Is there anything else happening with it?", "Mild fatigue"],
        ["Relieving factors", "What seems to make it better?", "Rest helps a little"],
        ["Aggravating factors", "What seems to make it worse?", "Worse after exertion"],
      ],
    },
    services: {
      cardiology: ["Cardiology consultation", "Dr. Asha Mwinyi", "TZS 85,000", "Tomorrow, 10:30"],
      diagnostics: ["Ultrasound scan", "Diagnostics team", "TZS 120,000", "Today, 15:20"],
      dental: ["Dental treatment", "Dr. Neema Joseph", "From TZS 60,000", "Today, 11:15"],
      pediatrics: ["Pediatric clinic", "Dr. Baraka Mushi", "TZS 70,000", "Tomorrow, 09:10"],
    },
    branches: {
      oysterbay: "Oysterbay Specialist Centre",
      masaki: "Masaki Imaging Wing",
      mikocheni: "Mikocheni Family Wing",
    },
    urgency: {
      routine: "Routine access request",
      sameDay: "Same-day pressure",
      risk: "Clinical-risk wording",
      unclear: "Unclear request",
    },
    chat: {
      title: "NeuroLux AI receptionist",
      patient: "Patient",
      neurolux: "NeuroLux",
      staff: "Clinical desk",
      manager: "Manager",
      safeStop:
        "I cannot assess symptoms or give medical advice in this chat. I am alerting clinic staff so a qualified person can review and call back.",
    },
    staff: {
      title: "Staff workbench",
      subtitle: "The clinic sees the exact packet needed to confirm, call back, or escalate.",
      packet: "Intake packet",
      queue: "Escalation queue",
      actionPrimary: "Confirm booking",
      actionRisk: "Call patient now",
      review: "Ready for staff review",
      source: "Source of truth: approved clinic services, slots, prices, and patient-provided intake.",
      upload: "Attached history",
    },
    manager: {
      title: "Executive view",
      subtitle: "A buyer sees the operational value without needing a backend demo.",
      conversion: "Conversion",
      recovered: "Recovered demand",
      attendance: "Attendance",
      workload: "Staff workload saved",
      revenue: "Revenue influenced",
      funnel: "Clinic revenue leakage",
      funnelLabels: ["Inquiry", "HPI", "Booking", "Attendance"],
      insight: "Structured HPI plus fast booking reduces back-and-forth and protects staff time.",
    },
    workflow: ["Capture", "HPI intake", "Verify service", "Book or escalate", "Follow up", "Measure"],
    disclaimer: "Demo only. No real patient data, no file upload, no diagnosis, no treatment plan.",
  },
  sw: {
    brand: "NeuroLux Medica",
    chooseLanguage: "Chagua lugha",
    heroTitle: "Mfumo wa upatikanaji wa huduma kwa kliniki za Tanzania, kutoka ujumbe wa kwanza hadi miadi.",
    heroBody:
      "Mfano huu unaonyesha jinsi NeuroLux inavyoweza kukusanya taarifa salama za awali, kuelewa nia ya kuweka miadi, kupeleka kesi hatarishi kwa wahudumu, na kuonyesha uongozi mahitaji ya wagonjwa na uwezo wa kliniki.",
    metrics: [
      ["Jibu la kwanza", "sek 8"],
      ["Mahitaji yaliyorejeshwa", "wagonjwa 34"],
      ["Ongezeko la mahudhurio", "+17%"],
      ["Thamani ya mfano", "TZS 18.6M"],
    ],
    roles: {
      patient: "Mgonjwa",
      staff: "Wahudumu",
      manager: "Meneja",
    },
    modes: {
      book: "Weka miadi",
      recover: "Rejesha aliyekwama",
      escalate: "Pandisha kwa usalama",
    },
    modeDescriptions: {
      book: "Mgonjwa anakamilisha HPI na kuchagua muda wa kliniki.",
      recover: "Mgonjwa anaacha mchakato, kisha anarudi baada ya ukumbusho.",
      escalate: "Maneno hatarishi au yasiyo wazi yanasimamisha mfumo na kupeleka kesi kwa wahudumu.",
    },
    controls: {
      title: "Vidhibiti vya onyesho",
      service: "Huduma",
      branch: "Tawi la kliniki",
      urgency: "Ishara ya mgonjwa",
      next: "Hatua inayofuata",
      back: "Rudi",
      reset: "Anza upya",
      upload: "Ambatanisha historia",
      uploadHelp: "PDF au picha kwa onyesho pekee. Hakuna kinachopakiwa au kuhifadhiwa.",
      noFile: "Hakuna faili",
      fileReady: "Faili iko tayari kwa mwonekano",
      consent: "Mgonjwa anakubali kuwa hii ni taarifa za awali kwa miadi na mapitio ya wahudumu tu.",
    },
    steps: ["Taarifa za mgonjwa", "Hitaji la huduma", "HPI salama", "Historia ya faili", "Muda wa miadi", "Uthibitisho"],
    fields: {
      patient: "Jina la mgonjwa",
      phone: "Simu",
      channel: "Njia anayopendelea",
      insurance: "Malipo / bima",
      clinician: "Mhudumu",
      branch: "Tawi",
      slot: "Muda anaopendelea",
      status: "Hali ya kesi",
    },
    patient: {
      title: "Taarifa za mgonjwa",
      subtitle: "Fomu elekezi na mazungumzo, iliyoundwa kwa matumizi ya simu.",
      name: "Amina Juma",
      phone: "+255 712 456 900",
      channel: "WhatsApp",
      insurance: "Pesa taslimu / mobile money",
      confirmed: "Miadi imethibitishwa",
      waiting: "Inamsubiri mgonjwa",
      recovered: "Amerejeshwa kwa ukumbusho",
      escalated: "Inahitaji mapitio ya mhudumu",
    },
    hpi: {
      title: "Historia ya ugonjwa uliopo",
      boundary: "NeuroLux hukusanya vipengele hivi saba tu vya HPI. Haitoi utambuzi, ushauri wa matibabu, wala haiendelei kuuliza zaidi kuhusu ugonjwa nje ya orodha hii.",
      waiting: "Inasubiri jibu",
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
    services: {
      cardiology: ["Ushauri wa moyo", "Dr. Asha Mwinyi", "TZS 85,000", "Kesho, 10:30"],
      diagnostics: ["Kipimo cha ultrasound", "Timu ya vipimo", "TZS 120,000", "Leo, 15:20"],
      dental: ["Huduma ya meno", "Dr. Neema Joseph", "Kuanzia TZS 60,000", "Leo, 11:15"],
      pediatrics: ["Kliniki ya watoto", "Dr. Baraka Mushi", "TZS 70,000", "Kesho, 09:10"],
    },
    branches: {
      oysterbay: "Oysterbay Specialist Centre",
      masaki: "Masaki Imaging Wing",
      mikocheni: "Mikocheni Family Wing",
    },
    urgency: {
      routine: "Ombi la kawaida",
      sameDay: "Uhitaji wa siku hiyo hiyo",
      risk: "Maneno yenye hatari ya kitabibu",
      unclear: "Ombi lisilo wazi",
    },
    chat: {
      title: "Mpokezi wa kidijitali wa NeuroLux",
      patient: "Mgonjwa",
      neurolux: "NeuroLux",
      staff: "Dawati la kliniki",
      manager: "Meneja",
      safeStop:
        "Siwezi kutathmini dalili wala kutoa ushauri wa matibabu kwenye mazungumzo haya. Ninaiarifu timu ya kliniki ili mhudumu mwenye sifa akague na kupiga simu.",
    },
    staff: {
      title: "Sehemu ya wahudumu",
      subtitle: "Kliniki inaona taarifa muhimu za kuthibitisha, kupiga simu, au kupandisha kesi.",
      packet: "Pakiti ya taarifa",
      queue: "Foleni ya mapitio",
      actionPrimary: "Thibitisha miadi",
      actionRisk: "Mpigie mgonjwa sasa",
      review: "Tayari kwa mapitio",
      source: "Chanzo sahihi: huduma, muda, bei zilizoidhinishwa na taarifa alizotoa mgonjwa.",
      upload: "Historia iliyoambatanishwa",
    },
    manager: {
      title: "Mwonekano wa uongozi",
      subtitle: "Mnunuzi anaona thamani ya uendeshaji bila kuhitaji mfumo wa nyuma.",
      conversion: "Ubadilishaji",
      recovered: "Mahitaji yaliyorejeshwa",
      attendance: "Mahudhurio",
      workload: "Muda wa wahudumu uliookolewa",
      revenue: "Mapato yaliyoathiriwa",
      funnel: "Upotevu wa mapato ya kliniki",
      funnelLabels: ["Swali", "HPI", "Miadi", "Mahudhurio"],
      insight: "HPI iliyopangwa pamoja na miadi ya haraka hupunguza kurudiana ujumbe na kulinda muda wa wahudumu.",
    },
    workflow: ["Pokea", "HPI ya awali", "Thibitisha huduma", "Weka miadi au pandisha", "Fuatilia", "Pima"],
    disclaimer: "Onyesho pekee. Hakuna data halisi ya mgonjwa, hakuna faili inayopakiwa, hakuna utambuzi, hakuna mpango wa matibabu.",
  },
};

const serviceKeys = ["cardiology", "diagnostics", "dental", "pediatrics"];
const branchKeys = ["oysterbay", "masaki", "mikocheni"];
const urgencyKeys = ["routine", "sameDay", "risk", "unclear"];

function initialLanguage() {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(LANG_STORAGE_KEY) || "en";
}

function fileLabel(file) {
  if (!file) return "";
  const kb = Math.max(1, Math.round(file.size / 1024));
  return `${file.name} - ${file.type || "file"} - ${kb} KB`;
}

export default function App() {
  const [language, setLanguage] = useState(initialLanguage);
  const [role, setRole] = useState("patient");
  const [mode, setMode] = useState("book");
  const [serviceKey, setServiceKey] = useState("cardiology");
  const [branchKey, setBranchKey] = useState("oysterbay");
  const [urgency, setUrgency] = useState("routine");
  const [step, setStep] = useState(2);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [staffAction, setStaffAction] = useState("");

  const t = translations[language];
  const [service, clinician, price, slot] = t.services[serviceKey];
  const risky = mode === "escalate" || urgency === "risk" || urgency === "unclear";
  const recovered = mode === "recover";
  const capturedHpi = risky ? 0 : recovered ? 4 : Math.min(t.hpi.items.length, step + 3);
  const status = risky ? t.patient.escalated : recovered ? t.patient.recovered : step >= 5 ? t.patient.confirmed : t.patient.waiting;

  const chat = useMemo(() => {
    if (risky) {
      return [
        [t.chat.patient, `${t.modeDescriptions.escalate} ${service}.`],
        [t.chat.neurolux, t.chat.safeStop],
        [t.chat.staff, `${t.staff.review}: ${t.branches[branchKey]}.`],
      ];
    }
    if (recovered) {
      return [
        [t.chat.patient, t.modeDescriptions.recover],
        [t.chat.neurolux, `${t.controls.uploadHelp} ${t.hpi.title}: ${capturedHpi} / ${t.hpi.items.length}.`],
        [t.chat.patient, language === "en" ? "Yes, reserve the available slot." : "Ndiyo, hifadhi muda uliopo."],
        [t.chat.neurolux, `${service} - ${slot} - ${clinician}.`],
      ];
    }
    return [
      [t.chat.patient, language === "en" ? `I want to book ${service}.` : `Nataka kuweka miadi ya ${service}.`],
      [t.chat.neurolux, t.hpi.boundary],
      [t.chat.patient, language === "en" ? "I completed the intake and selected my preferred time." : "Nimekamilisha taarifa za awali na kuchagua muda."],
      [t.chat.neurolux, `${service} - ${slot} - ${clinician} - ${price}.`],
    ];
  }, [branchKey, capturedHpi, clinician, language, price, recovered, risky, service, slot, t]);

  const managerStats = risky
    ? [["171", t.manager.conversion], ["13", t.manager.recovered], ["79%", t.manager.attendance], ["6.4h", t.manager.workload]]
    : recovered
      ? [["184", t.manager.conversion], ["21", t.manager.recovered], ["82%", t.manager.attendance], ["9.1h", t.manager.workload]]
      : [["166", t.manager.conversion], ["12", t.manager.recovered], ["81%", t.manager.attendance], ["7.8h", t.manager.workload]];

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, language);
    document.documentElement.lang = language === "sw" ? "sw-TZ" : "en";
  }, [language]);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function setScenario(nextMode) {
    setMode(nextMode);
    setUrgency(nextMode === "escalate" ? "risk" : "routine");
    setStep(nextMode === "recover" || nextMode === "escalate" ? 2 : 3);
    setStaffAction("");
  }

  function resetDemo() {
    setMode("book");
    setUrgency("routine");
    setStep(2);
    setFile(null);
    setStaffAction("");
  }

  return (
    <main className="shell">
      <div className="topbar">
        <div>
          <strong>{t.brand}</strong>
          <span>{t.disclaimer}</span>
        </div>
        <div className="language-switch" aria-label={t.chooseLanguage}>
          <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} type="button">English</button>
          <button className={language === "sw" ? "active" : ""} onClick={() => setLanguage("sw")} type="button">Kiswahili</button>
        </div>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <div className="brand-mark">NL</div>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroBody}</p>
        </div>
        <div className="hero-proof">
          {t.metrics.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="role-tabs" aria-label="Role views">
        {Object.entries(t.roles).map(([key, label]) => (
          <button className={role === key ? "active" : ""} key={key} onClick={() => setRole(key)} type="button">{label}</button>
        ))}
      </section>

      <section className="scenario-tabs" aria-label="Demo scenarios">
        {Object.entries(t.modes).map(([key, label]) => (
          <button className={mode === key ? "active" : ""} key={key} onClick={() => setScenario(key)} type="button">
            <strong>{label}</strong>
            <span>{t.modeDescriptions[key]}</span>
          </button>
        ))}
      </section>

      <section className="app-grid">
        <aside className="panel controls">
          <div className="panel-head">
            <p className="eyebrow">{t.controls.title}</p>
            <h2>{status}</h2>
          </div>
          <label>
            {t.controls.service}
            <select value={serviceKey} onChange={(event) => setServiceKey(event.target.value)}>
              {serviceKeys.map((key) => <option key={key} value={key}>{t.services[key][0]}</option>)}
            </select>
          </label>
          <label>
            {t.controls.branch}
            <select value={branchKey} onChange={(event) => setBranchKey(event.target.value)}>
              {branchKeys.map((key) => <option key={key} value={key}>{t.branches[key]}</option>)}
            </select>
          </label>
          <label>
            {t.controls.urgency}
            <select value={urgency} onChange={(event) => setUrgency(event.target.value)}>
              {urgencyKeys.map((key) => <option key={key} value={key}>{t.urgency[key]}</option>)}
            </select>
          </label>
          <div className="stepper">
            {t.steps.map((label, index) => (
              <button className={index <= step ? "done" : ""} key={label} onClick={() => setStep(index)} type="button">
                <span>{index + 1}</span>{label}
              </button>
            ))}
          </div>
          <div className="button-row">
            <button onClick={() => setStep((current) => Math.max(0, current - 1))} type="button">{t.controls.back}</button>
            <button className="primary" onClick={() => setStep((current) => Math.min(t.steps.length - 1, current + 1))} type="button">{t.controls.next}</button>
          </div>
          <button className="quiet-button" onClick={resetDemo} type="button">{t.controls.reset}</button>
        </aside>

        <section className={role === "patient" ? "workspace" : "workspace muted"}>
          <article className="panel patient-card">
            <div className="panel-head row">
              <div>
                <p className="eyebrow">{t.roles.patient}</p>
                <h2>{t.patient.title}</h2>
                <span>{t.patient.subtitle}</span>
              </div>
              <span className={risky ? "status amber" : "status green"}>{status}</span>
            </div>
            <div className="patient-layout">
              <div className="form-card">
                <dl>
                  <div><dt>{t.fields.patient}</dt><dd>{t.patient.name}</dd></div>
                  <div><dt>{t.fields.phone}</dt><dd>{t.patient.phone}</dd></div>
                  <div><dt>{t.fields.channel}</dt><dd>{t.patient.channel}</dd></div>
                  <div><dt>{t.fields.insurance}</dt><dd>{t.patient.insurance}</dd></div>
                  <div><dt>{t.fields.branch}</dt><dd>{t.branches[branchKey]}</dd></div>
                  <div><dt>{t.fields.slot}</dt><dd>{slot}</dd></div>
                </dl>
                <label className="upload-box">
                  <span>{t.controls.upload}</span>
                  <small>{t.controls.uploadHelp}</small>
                  <input accept="image/*,.pdf,application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} type="file" />
                </label>
                <div className="upload-preview">
                  {previewUrl ? <img alt="" src={previewUrl} /> : <span>{file ? fileLabel(file) : t.controls.noFile}</span>}
                </div>
              </div>
              <ChatCard chat={chat} title={t.chat.title} />
            </div>
          </article>

          <article className="panel hpi-card">
            <div className="panel-head row">
              <div>
                <p className="eyebrow">{t.hpi.title}</p>
                <h2>{capturedHpi} / {t.hpi.items.length}</h2>
              </div>
              <span className="status">{t.controls.consent}</span>
            </div>
            <p className="boundary">{t.hpi.boundary}</p>
            <div className="hpi-list">
              {t.hpi.items.map(([label, question, answer], index) => (
                <div className={index < capturedHpi ? "hpi-item captured" : "hpi-item"} key={label}>
                  <span>{index < capturedHpi ? "OK" : index + 1}</span>
                  <div>
                    <strong>{label}</strong>
                    <small>{question}</small>
                    <em>{index < capturedHpi ? answer : t.hpi.waiting}</em>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <aside className="side-stack">
          <article className={role === "staff" ? "panel staff-card" : "panel staff-card muted"}>
            <div className="panel-head">
              <p className="eyebrow">{t.roles.staff}</p>
              <h2>{t.staff.title}</h2>
              <span>{t.staff.subtitle}</span>
            </div>
            <div className="packet">
              <h3>{t.staff.packet}</h3>
              <dl>
                <div><dt>{t.controls.service}</dt><dd>{service}</dd></div>
                <div><dt>{t.fields.clinician}</dt><dd>{risky ? t.chat.staff : clinician}</dd></div>
                <div><dt>{t.fields.status}</dt><dd>{status}</dd></div>
                <div><dt>{t.staff.upload}</dt><dd>{file ? fileLabel(file) : t.controls.noFile}</dd></div>
              </dl>
              <button className={risky ? "danger-button" : "primary"} onClick={() => setStaffAction(risky ? t.staff.actionRisk : t.staff.actionPrimary)} type="button">
                {risky ? t.staff.actionRisk : t.staff.actionPrimary}
              </button>
              {staffAction && <p className="action-note">{staffAction}</p>}
              <p className="source-note">{t.staff.source}</p>
            </div>
          </article>

          <article className={role === "manager" ? "panel manager-card" : "panel manager-card muted"}>
            <div className="panel-head">
              <p className="eyebrow">{t.roles.manager}</p>
              <h2>{t.manager.title}</h2>
              <span>{t.manager.subtitle}</span>
            </div>
            <div className="manager-stats">
              {managerStats.map(([value, label]) => (
                <div key={label}><strong>{value}</strong><span>{label}</span></div>
              ))}
            </div>
            <div className="funnel">
              <h3>{t.manager.funnel}</h3>
              <div><span style={{ width: "100%" }} />{t.manager.funnelLabels[0]}</div>
              <div><span style={{ width: risky ? "58%" : "74%" }} />{t.manager.funnelLabels[1]}</div>
              <div><span style={{ width: recovered ? "68%" : "52%" }} />{t.manager.funnelLabels[2]}</div>
              <div><span style={{ width: risky ? "34%" : "61%" }} />{t.manager.funnelLabels[3]}</div>
            </div>
            <p className="source-note">{t.manager.insight}</p>
          </article>
        </aside>
      </section>

      <section className="workflow-board" aria-label="Workflow">
        {t.workflow.map((item, index) => (
          <div className={index <= step ? "workflow-step done" : "workflow-step"} key={item}>
            <span>{index + 1}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}

function ChatCard({ chat, title }) {
  return (
    <div className="chat-card">
      <h3>{title}</h3>
      <div className="phone-frame">
        {chat.map(([speaker, text], index) => (
          <div className={speaker.includes("NeuroLux") ? "bubble system" : speaker.includes("desk") || speaker.includes("kliniki") ? "bubble staff" : "bubble patient"} key={`${speaker}-${index}`}>
            <small>{speaker}</small>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
