// @ts-nocheck
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";

/* ============================================================
   NeuroLux Medica — Patient Access Platform Prototype
   Tanzania-focused, bilingual (English / Kiswahili)
   Single-file interactive prototype. All data is simulated.
   ============================================================ */

/* ---------------------------- THEME ---------------------------- */
const C = {
  teal: "#0E5E56",
  tealDark: "#0A423C",
  tealTint: "#E4F1EF",
  blue: "#1F5C8B",
  blueTint: "#E7F0F7",
  ink: "#122622",
  inkSoft: "#4B615C",
  line: "#DCE6E3",
  paper: "#FBFAF7",
  card: "#FFFFFF",
  success: "#2E7D46",
  successTint: "#E7F4EA",
  amber: "#B4790C",
  amberTint: "#FBF0DD",
  risk: "#B23A2E",
  riskTint: "#FBE9E6",
};

/* ---------------------------- GLOBAL STYLES ---------------------------- */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

      * { box-sizing: border-box; }
      html, body, #root { height: 100%; }
      body { margin: 0; }

      ::selection { background: ${C.tealTint}; color: ${C.tealDark}; }

      ::-webkit-scrollbar { width: 9px; height: 9px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 8px; }
      ::-webkit-scrollbar-thumb:hover { background: ${C.teal}55; }

      .nlm-fade-in { animation: nlmFadeIn 320ms ease both; }
      @keyframes nlmFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

      .nlm-pop { animation: nlmPop 420ms cubic-bezier(.2,.9,.3,1.2) both; }
      @keyframes nlmPop { from { opacity: 0; transform: scale(.85); } to { opacity: 1; transform: scale(1); } }

      button, input, select, textarea { font-family: inherit; }
      button:focus-visible, input:focus-visible, select:focus-visible {
        outline: 2.5px solid ${C.teal}66;
        outline-offset: 1px;
      }

      .btn-primary { background: ${C.teal}; color: #fff; box-shadow: 0 1px 2px rgba(10,66,60,0.12); }
      .btn-primary:hover:not(:disabled) { background: ${C.tealDark}; box-shadow: 0 4px 12px rgba(10,66,60,0.22); transform: translateY(-1px); }
      .btn-primary:active:not(:disabled) { transform: translateY(0); }

      .btn-secondary { background: #fff; color: ${C.teal}; border-color: ${C.teal}; }
      .btn-secondary:hover:not(:disabled) { background: ${C.tealTint}; }

      .btn-ghost:hover:not(:disabled) { background: ${C.paper}; color: ${C.ink}; }

      .btn-danger:hover:not(:disabled) { background: #942F25; }

      .nlm-tile { transition: border-color 140ms ease, background 140ms ease, box-shadow 140ms ease, transform 140ms ease; }
      .nlm-tile:hover { border-color: ${C.teal}; box-shadow: 0 3px 10px rgba(14,94,86,0.10); transform: translateY(-1px); }

      .nlm-role-tab { transition: background 140ms ease, color 140ms ease; }
      .nlm-lang-btn { transition: background 140ms ease, color 140ms ease; }

      .nlm-input { transition: border-color 140ms ease, box-shadow 140ms ease; }
      .nlm-input:focus { border-color: ${C.teal}; box-shadow: 0 0 0 3px ${C.teal}1f; outline: none; }

      .nlm-navlink { transition: opacity 140ms ease; }

      .nlm-hero {
        background:
          radial-gradient(720px 260px at 88% -10%, ${C.tealTint} 0%, rgba(228,241,239,0) 65%),
          radial-gradient(420px 220px at 6% 110%, ${C.blueTint} 0%, rgba(231,240,247,0) 60%);
      }

      .nlm-stat-chip { transition: transform 140ms ease; }
      .nlm-stat-chip:hover { transform: translateY(-2px); }

      @media (max-width: 760px) {
        .nlm-grid-2 { grid-template-columns: 1fr !important; }
        .nlm-hero-title { font-size: 26px !important; }
      }
    `}</style>
  );
}

/* ---------------------------- COPY / TRANSLATIONS ---------------------------- */
const dict = {
  appName: { en: "NeuroLux Medica", sw: "NeuroLux Medica" },
  tagline: {
    en: "Access, intake and booking for Tanzanian clinics — not diagnosis.",
    sw: "Upatikanaji, taarifa za awali na miadi kwa vituo vya afya Tanzania — si utambuzi.",
  },
  roles: {
    patient: { en: "Patient", sw: "Mgonjwa" },
    staff: { en: "Clinic staff", sw: "Wafanyakazi" },
    manager: { en: "Manager", sw: "Meneja" },
  },
  demoModes: {
    label: { en: "Demo scenario", sw: "Mfano wa maonyesho" },
    book: { en: "Book a patient", sw: "Weka miadi ya mgonjwa" },
    recover: { en: "Recover missed demand", sw: "Rejesha fursa zilizokosekana" },
    escalate: { en: "Escalate safely", sw: "Peleka kwa usalama" },
    manager: { en: "Manager view", sw: "Mtazamo wa meneja" },
  },
  safety: {
    banner1: {
      en: "This prototype collects access and intake information only.",
      sw: "Mfumo huu unakusanya taarifa za awali na miadi pekee.",
    },
    banner2: {
      en: "It does not provide diagnosis or treatment advice.",
      sw: "Hautoi utambuzi wala mpango wa matibabu.",
    },
    humanReview: { en: "Human review required", sw: "Uhakiki wa binadamu unahitajika" },
    noRealFiles: {
      en: "This prototype does not upload, transmit, or store real files.",
      sw: "Mfumo huu haupakii, hautumii, wala kuhifadhi faili halisi.",
    },
    automationNote: {
      en: "Automation supports intake and booking only. Clinical decisions are made by staff.",
      sw: "Otomatiki inasaidia taarifa za awali na uwekaji miadi pekee. Maamuzi ya kitabibu hufanywa na wafanyakazi.",
    },
  },
  nav: {
    step: { en: "Step", sw: "Hatua" },
    of: { en: "of", sw: "kati ya" },
    back: { en: "Back", sw: "Rudi" },
    next: { en: "Continue", sw: "Endelea" },
    reset: { en: "Start over", sw: "Anza upya" },
  },
  patient: {
    heroTitle: { en: "Find care, quickly and safely", sw: "Pata huduma, kwa haraka na usalama" },
    heroSub: {
      en: "Choose a service, tell us what's going on, and we'll match you to the right slot at a branch near you.",
      sw: "Chagua huduma, tueleze hali yako, tutakulinganisha na muda sahihi katika tawi lililo karibu nawe.",
    },
    chooseService: { en: "Choose a service", sw: "Chagua huduma" },
    chooseBranch: { en: "Choose a branch", sw: "Chagua tawi" },
    chooseSlot: { en: "Choose date & time", sw: "Chagua tarehe na saa" },
    yourDetails: { en: "Your details", sw: "Taarifa zako" },
    hpiTitle: { en: "Tell us about your symptom", sw: "Tueleze kuhusu dalili yako" },
    hpiSub: {
      en: "Seven quick questions. This is intake only — not a diagnosis.",
      sw: "Maswali saba ya haraka. Hii ni taarifa ya awali tu — si utambuzi.",
    },
    uploadTitle: { en: "Add previous medical documents (optional)", sw: "Ongeza nyaraka za awali za matibabu (hiari)" },
    chatTitle: { en: "Chat with the receptionist assistant", sw: "Ongea na msaidizi wa mapokezi" },
    confirmTitle: { en: "You're booked", sw: "Umepangiwa miadi" },
    fullName: { en: "Full name", sw: "Jina kamili" },
    phone: { en: "Phone number", sw: "Namba ya simu" },
    ageRange: { en: "Age range", sw: "Kundi la umri" },
    payment: { en: "Payment method", sw: "Njia ya malipo" },
    channel: { en: "Preferred contact channel", sw: "Njia unayopendelea kuwasiliana" },
    dropFiles: { en: "Drag files here or click to select", sw: "Buruta faili hapa au bofya kuchagua" },
    accepted: { en: "PDF, JPG, PNG accepted", sw: "PDF, JPG, PNG zinakubalika" },
    noFiles: { en: "No files added yet", sw: "Hakuna faili bado" },
    typeMessage: { en: "Type a message…", sw: "Andika ujumbe…" },
    send: { en: "Send", sw: "Tuma" },
    doctor: { en: "Doctor", sw: "Daktari" },
    branch: { en: "Branch", sw: "Tawi" },
    slot: { en: "Slot", sw: "Muda" },
    price: { en: "Estimated price", sw: "Makadirio ya gharama" },
    nextSteps: { en: "Next steps", sw: "Hatua zinazofuata" },
    nextStepsBody: {
      en: "Arrive 15 minutes early with a national ID. Bring any uploaded documents on paper if possible. You'll receive a reminder before your visit.",
      sw: "Wasili dakika 15 mapema ukiwa na kitambulisho. Leta nyaraka ulizopakia ukiwa na nakala ya karatasi ikiwezekana. Utapata ukumbusho kabla ya ziara yako.",
    },
    hpi: {
      duration: { en: "Duration — how long has this been going on?", sw: "Muda — hali hii imedumu kwa muda gani?" },
      onset: { en: "Onset — did it start suddenly or gradually?", sw: "Mwanzo — ilianza ghafla au taratibu?" },
      nature: { en: "Nature — how would you describe it?", sw: "Aina — ungeielezaje?" },
      periodicity: { en: "Periodicity — is it constant or does it come and go?", sw: "Marudio — ni ya kudumu au inajirudia?" },
      associated: { en: "Associated factors — anything else happening alongside it?", sw: "Mambo yanayoambatana — kuna kitu kingine kinachotokea pamoja nayo?" },
      relieving: { en: "Relieving factors — does anything make it better?", sw: "Vipunguza — kuna kitu kinachopunguza?" },
      aggravating: { en: "Aggravating factors — does anything make it worse?", sw: "Vizidishi — kuna kitu kinachozidisha?" },
    },
  },
  staff: {
    workbench: { en: "Case workbench", sw: "Dashibodi ya kesi" },
    incoming: { en: "Incoming cases", sw: "Kesi zinazoingia" },
    escalation: { en: "Escalation queue", sw: "Foleni ya kupelekwa" },
    packet: { en: "Intake packet", sw: "Pakiti ya taarifa" },
    patientDetails: { en: "Patient details", sw: "Taarifa za mgonjwa" },
    serviceSelected: { en: "Selected service", sw: "Huduma iliyochaguliwa" },
    hpiAnswers: { en: "History of Presenting Illness (HPI) answers", sw: "Majibu ya Historia ya Ugonjwa wa Sasa (HPI)" },
    fileMeta: { en: "Uploaded file metadata", sw: "Taarifa za faili zilizopakiwa" },
    branchSlot: { en: "Preferred branch & slot", sw: "Tawi na muda unaopendelea" },
    riskStatus: { en: "Risk status", sw: "Hali ya hatari" },
    bookingStatus: { en: "Booking status", sw: "Hali ya miadi" },
    confirmBooking: { en: "Confirm booking", sw: "Thibitisha miadi" },
    requestCallback: { en: "Request callback", sw: "Omba kupigiwa simu" },
    markReviewed: { en: "Mark as reviewed", sw: "Weka kama imehakikiwa" },
    sendFollowup: { en: "Send safe follow-up message", sw: "Tuma ujumbe salama wa ufuatiliaji" },
    sourceOfTruth: { en: "Source of truth", sw: "Chanzo cha taarifa sahihi" },
    approvedServices: { en: "Approved services", sw: "Huduma zilizoidhinishwa" },
    doctorsOnDuty: { en: "Doctors on duty", sw: "Madaktari zamu" },
    branchCapacity: { en: "Branch capacity today", sw: "Uwezo wa tawi leo" },
    noCases: { en: "No cases in this queue yet", sw: "Hakuna kesi kwenye foleni hii bado" },
  },
  manager: {
    dashboard: { en: "Executive dashboard", sw: "Dashibodi ya uongozi" },
    mockNote: { en: "All figures are mock / demo data", sw: "Takwimu zote ni za mfano / maonyesho" },
    totalInquiries: { en: "Total inquiries", sw: "Maswali yote" },
    conversion: { en: "Conversion rate", sw: "Kiwango cha ubadilishaji" },
    bookings: { en: "Bookings created", sw: "Miadi iliyowekwa" },
    recovered: { en: "Recovered bookings", sw: "Miadi iliyorejeshwa" },
    attendance: { en: "No-show improvement", sw: "Uboreshaji wa mahudhurio" },
    workloadSaved: { en: "Staff workload saved", sw: "Muda wa wafanyakazi ulioongoka" },
    revenue: { en: "Revenue-influenced estimate", sw: "Makadirio ya mapato yaliyoathiriwa" },
    escalations: { en: "Escalation volume", sw: "Idadi ya upelekaji" },
    funnel: { en: "Patient funnel", sw: "Mtiririko wa mgonjwa" },
    demand: { en: "Service demand by category", sw: "Mahitaji ya huduma kwa aina" },
    branchView: { en: "Branch capacity", sw: "Uwezo wa matawi" },
    recoveryPerf: { en: "Recovery performance", sw: "Ufanisi wa urejeshaji" },
    workloadSummary: { en: "Staff workload summary", sw: "Muhtasari wa kazi za wafanyakazi" },
  },
  workflow: {
    title: { en: "Workflow board", sw: "Ubao wa mtiririko wa kazi" },
    capture: { en: "Capture", sw: "Kunasa" },
    hpi: { en: "History of Presenting Illness (HPI) intake", sw: "Historia ya Ugonjwa wa Sasa (HPI)" },
    verify: { en: "Verify service", sw: "Thibitisha huduma" },
    bookEscalate: { en: "Book or escalate", sw: "Weka miadi au peleka" },
    followUp: { en: "Follow up", sw: "Fuatilia" },
    measure: { en: "Measure", sw: "Pima" },
  },
  common: {
    riskLow: { en: "Low risk", sw: "Hatari ndogo" },
    riskReview: { en: "Needs review", sw: "Inahitaji uhakiki" },
    pending: { en: "Pending", sw: "Inasubiri" },
    confirmed: { en: "Confirmed", sw: "Imethibitishwa" },
    reviewed: { en: "Reviewed", sw: "Imehakikiwa" },
  },
};
const t = (path, lang) => {
  const parts = path.split(".");
  let node = dict;
  for (const p of parts) node = node?.[p];
  return node?.[lang] ?? node?.en ?? path;
};

/* ---------------------------- MOCK DATA ---------------------------- */
const SERVICES = [
  { id: "cardiology", en: "Cardiology", sw: "Magonjwa ya Moyo", price: 45000 },
  { id: "ultrasound", en: "Ultrasound", sw: "Ultrasound", price: 30000 },
  { id: "dental", en: "Dental", sw: "Meno", price: 25000 },
  { id: "pediatrics", en: "Pediatrics", sw: "Watoto", price: 20000 },
  { id: "general", en: "General consultation", sw: "Ushauri wa Jumla", price: 15000 },
  { id: "lab", en: "Laboratory", sw: "Maabara", price: 18000 },
  { id: "antenatal", en: "Antenatal care", sw: "Huduma ya Uzazi", price: 22000 },
  { id: "referral", en: "Specialist referral", sw: "Rufaa ya Mtaalamu", price: 0 },
];

const BRANCHES = [
  { id: "mikocheni", en: "Mikocheni Clinic", sw: "Kliniki ya Mikocheni", city: "Dar es Salaam" },
  { id: "kariakoo", en: "Kariakoo Health Centre", sw: "Kituo cha Afya Kariakoo", city: "Dar es Salaam" },
  { id: "mbezi", en: "Mbezi Beach Clinic", sw: "Kliniki ya Mbezi Beach", city: "Dar es Salaam" },
  { id: "arusha", en: "Arusha City Hospital", sw: "Hospitali ya Jiji la Arusha", city: "Arusha" },
  { id: "mwanza", en: "Mwanza Lakeview Clinic", sw: "Kliniki ya Mwanza Lakeview", city: "Mwanza" },
];

const DOCTORS = [
  { id: "d1", name: "Dr. A. Mushi", service: "cardiology" },
  { id: "d2", name: "Dr. F. Kileo", service: "ultrasound" },
  { id: "d3", name: "Dr. N. Massawe", service: "dental" },
  { id: "d4", name: "Dr. R. Komba", service: "pediatrics" },
  { id: "d5", name: "Dr. J. Mrema", service: "general" },
  { id: "d6", name: "Dr. E. Ngowi", service: "lab" },
  { id: "d7", name: "Dr. S. Lyimo", service: "antenatal" },
  { id: "d8", name: "Dr. P. Chuma", service: "referral" },
];

const SLOTS = ["08:30", "09:15", "10:00", "11:30", "13:00", "14:45", "16:00"];

const AGE_RANGES = ["0–12", "13–17", "18–30", "31–45", "46–60", "60+"];
const PAYMENT_METHODS = [
  { id: "insurance", en: "Insurance (NHIF/private)", sw: "Bima (NHIF/binafsi)" },
  { id: "mobilemoney", en: "Mobile money", sw: "Pesa ya simu" },
  { id: "cash", en: "Cash on arrival", sw: "Fedha taslimu" },
];
const CHANNELS = [
  { id: "sms", en: "SMS", sw: "SMS" },
  { id: "whatsapp", en: "WhatsApp", sw: "WhatsApp" },
  { id: "call", en: "Phone call", sw: "Simu" },
];

const RISK_KEYWORDS = [
  "chest pain", "maumivu ya kifua", "can't breathe", "sipumui", "bleeding heavily",
  "unconscious", "poisoning", "suicide", "sumu", "kuzimia", "damu nyingi",
];

const DASHBOARD_METRICS = {
  totalInquiries: 1284,
  conversion: 0.61,
  bookings: 784,
  recovered: 96,
  attendance: 0.18,
  workloadSaved: "126 hrs/mo",
  revenue: "TZS 18.4M",
  escalations: 37,
};

const FUNNEL = [
  { en: "Inquiry", sw: "Swali la mgonjwa", value: 1284 },
  { en: "History of Presenting Illness completed", sw: "Historia ya Ugonjwa wa Sasa imekamilika", value: 1041 },
  { en: "Slot selected", sw: "Muda umechaguliwa", value: 902 },
  { en: "Booking confirmed", sw: "Miadi imethibitishwa", value: 784 },
  { en: "Attended", sw: "Amehudhuria", value: 668 },
];

const DEMAND = [
  { id: "general", value: 312 },
  { id: "dental", value: 198 },
  { id: "antenatal", value: 176 },
  { id: "cardiology", value: 154 },
  { id: "ultrasound", value: 141 },
  { id: "lab", value: 122 },
  { id: "pediatrics", value: 118 },
  { id: "referral", value: 63 },
];

const BRANCH_CAPACITY = [
  { id: "mikocheni", used: 78 },
  { id: "kariakoo", used: 92 },
  { id: "mbezi", used: 54 },
  { id: "arusha", used: 65 },
  { id: "mwanza", used: 71 },
];

const STAFF_WORKLOAD = [
  { name: "Front desk", before: 100, after: 58 },
  { name: "Nurses (triage)", before: 100, after: 71 },
  { name: "Call centre", before: 100, after: 49 },
];

const WORKFLOW_STAGES = ["capture", "hpi", "verify", "bookEscalate", "followUp", "measure"];

/* ---------------------------- HELPERS ---------------------------- */
function detectRisk(text) {
  const low = text.toLowerCase();
  return RISK_KEYWORDS.some((k) => low.includes(k.toLowerCase()));
}
function fmtTZS(n) {
  if (!n) return "—";
  return "TZS " + n.toLocaleString("en-US");
}
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ---------------------------- SMALL UI PRIMITIVES ---------------------------- */
function Pill({ tone = "neutral", children }) {
  const tones = {
    neutral: { bg: C.tealTint, fg: C.tealDark },
    success: { bg: C.successTint, fg: C.success },
    amber: { bg: C.amberTint, fg: C.amber },
    risk: { bg: C.riskTint, fg: C.risk },
    blue: { bg: C.blueTint, fg: C.blue },
  };
  const s = tones[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 600,
        background: s.bg,
        color: s.fg,
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, style, padded = true }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        boxShadow: "0 1px 3px rgba(18,38,34,0.04)",
        padding: padded ? "20px 22px" : 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", disabled, style, type = "button" }) {
  const base = {
    fontFamily: "inherit",
    fontSize: 14.5,
    fontWeight: 600,
    padding: "10px 18px",
    borderRadius: 9,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid transparent",
    transition: "background 120ms ease, border-color 120ms ease, color 120ms ease",
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: C.teal, color: "#fff" },
    secondary: { background: "#fff", color: C.teal, borderColor: C.teal },
    ghost: { background: "transparent", color: C.inkSoft, borderColor: "transparent" },
    danger: { background: C.risk, color: "#fff" },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn-${variant}`}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

function ProgressTrack({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 4,
            flex: 1,
            borderRadius: 2,
            background: i <= step ? C.teal : C.line,
            transition: "background 200ms ease",
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------- SAFETY BANNER ---------------------------- */
function SafetyBanner({ lang }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        background: C.tealTint,
        border: `1px solid ${C.teal}22`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        color: C.tealDark,
      }}
    >
      <ShieldIcon />
      <div>
        <div style={{ fontWeight: 600 }}>{t("safety.banner1", lang)}</div>
        <div style={{ opacity: 0.85 }}>{t("safety.banner2", lang)}</div>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path
        d="M12 2.5l7.5 3v6c0 5-3.2 8.6-7.5 10-4.3-1.4-7.5-5-7.5-10v-6l7.5-3z"
        stroke={C.teal}
        strokeWidth="1.6"
        fill="none"
      />
      <path d="M8.7 12.2l2.3 2.3 4.3-4.6" stroke={C.teal} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============================================================
   APP SHELL
   ============================================================ */
export default function NeuroLuxMedica({ initialRole = "patient" }) {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    const savedLang = window.localStorage.getItem("nlm_lang");
    if (savedLang === "en" || savedLang === "sw") setLang(savedLang);
  }, []);
  const [role, setRole] = useState(initialRole);
  const [demoMode, setDemoMode] = useState("book");
  const [cases, setCases] = useState(() => seedCases());
  const [stageByCase, setStageByCase] = useState({}); // caseId -> workflow stage index

  useEffect(() => {
    localStorage.setItem("nlm_lang", lang);
  }, [lang]);

  function addCase(newCase) {
    setCases((prev) => [newCase, ...prev]);
    setStageByCase((prev) => ({ ...prev, [newCase.id]: 3 })); // booked/escalated by the time it reaches staff
  }
  function updateCase(id, patch) {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: C.paper,
        color: C.ink,
        minHeight: "100%",
        width: "100%",
      }}
    >
      <GlobalStyles />
      <TopBar lang={lang} setLang={setLang} role={role} setRole={setRole} />
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 20px 60px" }}>
        <DemoModeBar lang={lang} demoMode={demoMode} setDemoMode={setDemoMode} role={role} setRole={setRole} />
        <div style={{ marginTop: 16, marginBottom: 20 }}>
          <SafetyBanner lang={lang} />
        </div>

        {role === "patient" && (
          <PatientView lang={lang} demoMode={demoMode} onBooked={addCase} />
        )}
        {role === "staff" && (
          <StaffView lang={lang} cases={cases} updateCase={updateCase} demoMode={demoMode} />
        )}
        {role === "manager" && <ManagerView lang={lang} cases={cases} />}
      </div>
    </div>
  );
}

function seedCases() {
  return [
    {
      id: uid(),
      name: "Grace Mwakalinga",
      phone: "+255 712 345 678",
      ageRange: "31–45",
      service: "cardiology",
      branch: "mikocheni",
      slot: "10:00",
      payment: "insurance",
      channel: "sms",
      hpi: {
        duration: "3 days",
        onset: "Sudden, at rest",
        nature: "Tight, pressure-like",
        periodicity: "Comes and goes",
        associated: "Mild shortness of breath",
        relieving: "Sitting upright",
        aggravating: "Walking upstairs",
      },
      files: [{ name: "ecg_2024.pdf", type: "application/pdf", size: 482000 }],
      risk: "review",
      bookingStatus: "pending",
      reviewed: false,
      createdVia: "escalate",
    },
    {
      id: uid(),
      name: "Baraka Ndosi",
      phone: "+255 754 221 903",
      ageRange: "18–30",
      service: "dental",
      branch: "kariakoo",
      slot: "14:45",
      payment: "mobilemoney",
      channel: "whatsapp",
      hpi: {
        duration: "1 week",
        onset: "Gradual",
        nature: "Dull ache",
        periodicity: "Constant",
        associated: "Slight swelling",
        relieving: "Cold water",
        aggravating: "Chewing",
      },
      files: [],
      risk: "low",
      bookingStatus: "confirmed",
      reviewed: true,
      createdVia: "book",
    },
  ];
}

/* ---------------------------- TOP BAR ---------------------------- */
function TopBar({ lang, setLang, role, setRole }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${C.line}`,
        background: C.card,
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark />
          <div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: C.tealDark }}>
              {t("appName", lang)}
            </div>
            <div style={{ fontSize: 12, color: C.inkSoft }}>{t("tagline", lang)}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <RoleTabs role={role} setRole={setRole} lang={lang} />
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
      <rect x="1" y="1" width="38" height="38" rx="11" fill={C.teal} />
      <path d="M11 27V13h3.4l9.3 9.9V13H27v14h-3.3l-9.4-10v10H11z" fill="#fff" />
    </svg>
  );
}

function RoleTabs({ role, setRole, lang }) {
  const roles = ["patient", "staff", "manager"];
  return (
    <div style={{ display: "flex", background: C.paper, borderRadius: 10, padding: 3, border: `1px solid ${C.line}` }}>
      {roles.map((r) => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className="nlm-role-tab"
          style={{
            border: "none",
            padding: "7px 14px",
            fontSize: 13.5,
            fontWeight: 600,
            borderRadius: 8,
            cursor: "pointer",
            background: role === r ? C.teal : "transparent",
            color: role === r ? "#fff" : C.inkSoft,
            fontFamily: "inherit",
          }}
        >
          {t(`roles.${r}`, lang)}
        </button>
      ))}
    </div>
  );
}

function LangSwitcher({ lang, setLang }) {
  return (
    <div style={{ display: "flex", border: `1px solid ${C.line}`, borderRadius: 999, overflow: "hidden" }}>
      {["en", "sw"].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="nlm-lang-btn"
          style={{
            border: "none",
            padding: "7px 13px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            background: lang === l ? C.tealDark : "#fff",
            color: lang === l ? "#fff" : C.inkSoft,
            fontFamily: "inherit",
          }}
        >
          {l === "en" ? "EN" : "SW"}
        </button>
      ))}
    </div>
  );
}

function DemoModeBar({ lang, demoMode, setDemoMode, setRole }) {
  const modes = [
    { id: "book", role: "patient" },
    { id: "recover", role: "patient" },
    { id: "escalate", role: "patient" },
    { id: "manager", role: "manager" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", paddingTop: 14 }}>
      <span style={{ fontSize: 12.5, color: C.inkSoft, fontWeight: 600 }}>{t("demoModes.label", lang)}:</span>
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => {
            setDemoMode(m.id);
            setRole(m.role);
          }}
          style={{
            border: `1px solid ${demoMode === m.id ? C.teal : C.line}`,
            background: demoMode === m.id ? C.tealTint : "#fff",
            color: demoMode === m.id ? C.tealDark : C.inkSoft,
            borderRadius: 999,
            padding: "6px 13px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {t(`demoModes.${m.id}`, lang)}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   WORKFLOW BOARD (shared)
   ============================================================ */
function WorkflowBoard({ lang, activeIndex }) {
  return (
    <Card style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 14, color: C.tealDark }}>
        {t("workflow.title", lang)}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {WORKFLOW_STAGES.map((s, i) => {
          const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "todo";
          return (
            <React.Fragment key={s}>
              <div
                style={{
                  flex: "1 1 120px",
                  minWidth: 110,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${state === "active" ? C.teal : C.line}`,
                  background: state === "done" ? C.successTint : state === "active" ? C.tealTint : "#fff",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 700, color: state === "todo" ? C.inkSoft : C.tealDark }}>
                  {t(`workflow.${s}`, lang)}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
}

/* ============================================================
   PATIENT VIEW
   ============================================================ */
const PATIENT_STEPS = ["service", "branch", "slot", "details", "hpi", "upload", "chat", "confirm"];

function PatientView({ lang, demoMode, onBooked }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState(emptyForm());
  const [files, setFiles] = useState([]);
  const [chatLog, setChatLog] = useState([]);
  const [risk, setRisk] = useState("low");
  const [caseId] = useState(() => uid());
  const [booked, setBooked] = useState(false);

  function emptyForm() {
    return {
      service: demoMode === "recover" ? "antenatal" : "",
      branch: "",
      slot: "",
      name: "",
      phone: "",
      ageRange: "",
      payment: "",
      channel: "",
      hpi: { duration: "", onset: "", nature: "", periodicity: "", associated: "", relieving: "", aggravating: "" },
    };
  }

  // reset wizard on demo mode change for a clean story
  useEffect(() => {
    setStepIdx(0);
    setForm(emptyForm());
    setFiles([]);
    setChatLog([]);
    setRisk("low");
    setBooked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode]);

  const workflowIndex = Math.min(stepIdx, 5);

  function next() {
    setStepIdx((s) => Math.min(s + 1, PATIENT_STEPS.length - 1));
  }
  function back() {
    setStepIdx((s) => Math.max(s - 1, 0));
  }

  function finalizeBooking(finalRisk) {
    const svc = SERVICES.find((s) => s.id === form.service);
    const doc = DOCTORS.find((d) => d.service === form.service);
    const newCase = {
      id: caseId,
      name: form.name || "Walk-in patient",
      phone: form.phone || "—",
      ageRange: form.ageRange,
      service: form.service,
      branch: form.branch,
      slot: form.slot,
      payment: form.payment,
      channel: form.channel,
      hpi: form.hpi,
      files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      risk: finalRisk,
      bookingStatus: finalRisk === "review" ? "pending" : "confirmed",
      reviewed: false,
      createdVia: demoMode,
      doctor: doc?.name,
      price: svc?.price,
    };
    onBooked(newCase);
    setBooked(true);
    setStepIdx(PATIENT_STEPS.length - 1);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
      <WorkflowBoard lang={lang} activeIndex={workflowIndex} />

      <div className="nlm-grid-2" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 20 }}>
        <Card padded={stepIdx !== 0} style={stepIdx === 0 ? { overflow: "hidden" } : undefined}>
          {stepIdx === 0 && (
            <div key="step0" className="nlm-fade-in">
              <div className="nlm-hero" style={{ padding: "26px 22px 22px" }}>
                <SectionHeading lang={lang} title={t("patient.heroTitle", lang)} sub={t("patient.heroSub", lang)} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                  <StatChip value={SERVICES.length} label={lang === "en" ? "services" : "huduma"} />
                  <StatChip value={BRANCHES.length} label={lang === "en" ? "branches" : "matawi"} />
                  <StatChip value="24/7" label={lang === "en" ? "intake" : "taarifa za awali"} />
                </div>
              </div>
              <div style={{ padding: "20px 22px 22px" }}>
              <StepLabel lang={lang} idx={0} />
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 14.5, fontWeight: 700, margin: "14px 0 10px" }}>{t("patient.chooseService", lang)}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 10 }}>
                {SERVICES.map((s) => (
                  <SelectTile
                    key={s.id}
                    active={form.service === s.id}
                    label={lang === "en" ? s.en : s.sw}
                    sub={s.price ? fmtTZS(s.price) : "—"}
                    onClick={() => setForm((f) => ({ ...f, service: s.id }))}
                  />
                ))}
              </div>
              <StepFooter lang={lang} onNext={next} nextDisabled={!form.service} />
              </div>
            </div>
          )}

          {stepIdx === 1 && (
            <div key="step1" className="nlm-fade-in">
              <StepLabel lang={lang} idx={1} />
              <div style={{ fontSize: 14.5, fontWeight: 700, margin: "14px 0 10px" }}>{t("patient.chooseBranch", lang)}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px,1fr))", gap: 10 }}>
                {BRANCHES.map((b) => (
                  <SelectTile
                    key={b.id}
                    active={form.branch === b.id}
                    label={lang === "en" ? b.en : b.sw}
                    sub={b.city}
                    onClick={() => setForm((f) => ({ ...f, branch: b.id }))}
                  />
                ))}
              </div>
              <StepFooter lang={lang} onBack={back} onNext={next} nextDisabled={!form.branch} />
            </div>
          )}

          {stepIdx === 2 && (
            <div key="step2" className="nlm-fade-in">
              <StepLabel lang={lang} idx={2} />
              <div style={{ fontSize: 14.5, fontWeight: 700, margin: "14px 0 10px" }}>{t("patient.chooseSlot", lang)}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px,1fr))", gap: 10 }}>
                {SLOTS.map((s) => (
                  <SelectTile key={s} active={form.slot === s} label={s} onClick={() => setForm((f) => ({ ...f, slot: s }))} />
                ))}
              </div>
              <StepFooter lang={lang} onBack={back} onNext={next} nextDisabled={!form.slot} />
            </div>
          )}

          {stepIdx === 3 && (
            <div key="step3" className="nlm-fade-in">
              <StepLabel lang={lang} idx={3} />
              <div style={{ fontSize: 14.5, fontWeight: 700, margin: "14px 0 14px" }}>{t("patient.yourDetails", lang)}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label={t("patient.fullName", lang)}>
                  <input className={inputClass} style={inputStyle} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </Field>
                <Field label={t("patient.phone", lang)}>
                  <input className={inputClass} style={inputStyle} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+255 7xx xxx xxx" />
                </Field>
                <Field label={t("patient.ageRange", lang)}>
                  <select className={inputClass} style={inputStyle} value={form.ageRange} onChange={(e) => setForm((f) => ({ ...f, ageRange: e.target.value }))}>
                    <option value="">—</option>
                    {AGE_RANGES.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </Field>
                <Field label={t("patient.payment", lang)}>
                  <select className={inputClass} style={inputStyle} value={form.payment} onChange={(e) => setForm((f) => ({ ...f, payment: e.target.value }))}>
                    <option value="">—</option>
                    {PAYMENT_METHODS.map((p) => (
                      <option key={p.id} value={p.id}>{lang === "en" ? p.en : p.sw}</option>
                    ))}
                  </select>
                </Field>
                <Field label={t("patient.channel", lang)}>
                  <select className={inputClass} style={inputStyle} value={form.channel} onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value }))}>
                    <option value="">—</option>
                    {CHANNELS.map((c) => (
                      <option key={c.id} value={c.id}>{lang === "en" ? c.en : c.sw}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <StepFooter lang={lang} onBack={back} onNext={next} nextDisabled={!form.name || !form.phone || !form.ageRange} />
            </div>
          )}

          {stepIdx === 4 && (
            <div key="step4" className="nlm-fade-in">
              <StepLabel lang={lang} idx={4} />
              <SectionHeading lang={lang} title={t("patient.hpiTitle", lang)} sub={t("patient.hpiSub", lang)} compact />
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                {Object.keys(form.hpi).map((k) => (
                  <Field key={k} label={t(`patient.hpi.${k}`, lang)}>
                    <input
                      className={inputClass} style={inputStyle}
                      value={form.hpi[k]}
                      onChange={(e) => setForm((f) => ({ ...f, hpi: { ...f.hpi, [k]: e.target.value } }))}
                    />
                  </Field>
                ))}
              </div>
              <StepFooter
                lang={lang}
                onBack={back}
                onNext={next}
                nextDisabled={Object.values(form.hpi).some((v) => !v)}
              />
            </div>
          )}

          {stepIdx === 5 && (
            <div key="step5" className="nlm-fade-in">
              <StepLabel lang={lang} idx={5} />
              <div style={{ fontSize: 14.5, fontWeight: 700, margin: "14px 0 6px" }}>{t("patient.uploadTitle", lang)}</div>
              <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 12 }}>{t("safety.noRealFiles", lang)}</div>
              <UploadBox lang={lang} files={files} setFiles={setFiles} />
              <StepFooter lang={lang} onBack={back} onNext={next} />
            </div>
          )}

          {stepIdx === 6 && (
            <div key="step6" className="nlm-fade-in">
              <StepLabel lang={lang} idx={6} />
              <ChatPanel
                lang={lang}
                form={form}
                chatLog={chatLog}
                setChatLog={setChatLog}
                risk={risk}
                setRisk={setRisk}
                onBook={() => finalizeBooking(risk)}
                onBack={back}
              />
            </div>
          )}

          {stepIdx === 7 && booked && (
            <ConfirmationCard lang={lang} form={form} risk={risk} onReset={() => window.location.reload()} />
          )}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SummaryCard lang={lang} form={form} files={files} risk={stepIdx >= 6 ? risk : null} />
        </div>
      </div>
    </div>
  );
}

function StepLabel({ lang, idx }) {
  return (
    <>
      <ProgressTrack step={idx} total={PATIENT_STEPS.length} />
      <div style={{ fontSize: 12, fontWeight: 600, color: C.inkSoft, marginBottom: 2 }}>
        {t("nav.step", lang)} {idx + 1} {t("nav.of", lang)} {PATIENT_STEPS.length}
      </div>
    </>
  );
}

function SectionHeading({ lang, title, sub, compact }) {
  return (
    <div style={{ marginBottom: compact ? 0 : 4 }}>
      <div
        className={compact ? "" : "nlm-hero-title"}
        style={{ fontFamily: "'Sora', sans-serif", fontSize: compact ? 18 : 30, fontWeight: 700, letterSpacing: "-0.02em", color: C.tealDark, lineHeight: 1.15 }}
      >
        {title}
      </div>
      {sub && <div style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 5, maxWidth: 520 }}>{sub}</div>}
    </div>
  );
}

function StatChip({ value, label }) {
  return (
    <div
      className="nlm-stat-chip"
      style={{
        background: "#fff",
        border: `1px solid ${C.line}`,
        borderRadius: 10,
        padding: "8px 14px",
        display: "flex",
        alignItems: "baseline",
        gap: 6,
      }}
    >
      <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: C.tealDark }}>{value}</span>
      <span style={{ fontSize: 12, color: C.inkSoft }}>{label}</span>
    </div>
  );
}

function SelectTile({ active, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="nlm-tile"
      style={{
        textAlign: "left",
        padding: "12px 13px",
        borderRadius: 10,
        border: `1.5px solid ${active ? C.teal : C.line}`,
        background: active ? C.tealTint : "#fff",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <div style={{ fontSize: 13.5, fontWeight: 700, color: active ? C.tealDark : C.ink }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>{sub}</div>}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>{label}</div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 11px",
  borderRadius: 8,
  border: `1px solid ${C.line}`,
  fontSize: 14,
  fontFamily: "inherit",
  background: "#fff",
  color: C.ink,
};
const inputClass = "nlm-input";

function StepFooter({ lang, onBack, onNext, nextDisabled }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
      {onBack ? <Button variant="ghost" onClick={onBack}>{t("nav.back", lang)}</Button> : <span />}
      {onNext && <Button onClick={onNext} disabled={nextDisabled}>{t("nav.next", lang)}</Button>}
    </div>
  );
}

function UploadBox({ lang, files, setFiles }) {
  const ref = useRef();
  function handleFiles(list) {
    const arr = Array.from(list).map((f) => ({ name: f.name, type: f.type || "unknown", size: f.size }));
    setFiles((prev) => [...prev, ...arr]);
  }
  return (
    <div>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          border: `1.5px dashed ${C.line}`,
          borderRadius: 12,
          padding: "28px 16px",
          textAlign: "center",
          cursor: "pointer",
          background: C.paper,
        }}
      >
        <input
          ref={ref}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div style={{ fontSize: 14, fontWeight: 600, color: C.tealDark }}>{t("patient.dropFiles", lang)}</div>
        <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 4 }}>{t("patient.accepted", lang)}</div>
      </div>
      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {files.length === 0 && <div style={{ fontSize: 13, color: C.inkSoft }}>{t("patient.noFiles", lang)}</div>}
        {files.map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              border: `1px solid ${C.line}`,
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{f.name}</div>
              <div style={{ color: C.inkSoft, fontSize: 11.5 }}>
                {f.type} • {(f.size / 1024).toFixed(0)} KB
              </div>
            </div>
            <button
              onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
              style={{ border: "none", background: "none", color: C.risk, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- CHAT PANEL ---------------------------- */
function ChatPanel({ lang, form, chatLog, setChatLog, risk, setRisk, onBook, onBack }) {
  const [input, setInput] = useState("");
  const [escalated, setEscalated] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (chatLog.length === 0) {
      const svc = SERVICES.find((s) => s.id === form.service);
      const greet =
        lang === "en"
          ? `Hello! I can see you'd like to book ${svc ? svc.en.toLowerCase() : "a service"}. Feel free to tell me anything more, or tap "Confirm booking" when ready.`
          : `Habari! Naona ungependa kuweka miadi ya ${svc ? svc.sw.toLowerCase() : "huduma"}. Niambie zaidi, au bofya "Thibitisha miadi" ukiwa tayari.`;
      setChatLog([{ from: "bot", text: greet }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatLog]);

  function send() {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    const isRisk = detectRisk(input);
    let botMsg;
    if (isRisk) {
      setRisk("review");
      setEscalated(true);
      botMsg = {
        from: "bot",
        tone: "risk",
        text:
          lang === "en"
            ? `${t("safety.humanReview", lang)}. I've flagged this for our clinical staff to review right away and prioritized your case. Please continue — a team member will follow up shortly.`
            : `${t("safety.humanReview", lang)}. Nimewasilisha hii kwa wafanyakazi wetu wa kitabibu ili kuihakiki mara moja na kuipa kipaumbele. Tafadhali endelea — mfanyakazi atakufuatilia hivi karibuni.`,
      };
    } else {
      botMsg = {
        from: "bot",
        text:
          lang === "en"
            ? "Thanks — noted. I'm not able to give medical advice, but I've added this to your intake notes for the clinical team. Ready to confirm your booking?"
            : "Asante — nimeandika. Siwezi kutoa ushauri wa kitabibu, lakini nimeongeza hii kwenye taarifa zako kwa timu ya kitabibu. Uko tayari kuthibitisha miadi yako?",
      };
    }
    setChatLog((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  return (
    <div>
      <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>{t("patient.chatTitle", lang)}</div>
      {escalated && (
        <div style={{ marginBottom: 10 }}>
          <Pill tone="risk">{t("safety.humanReview", lang)}</Pill>
        </div>
      )}
      <div
        ref={scrollRef}
        style={{
          height: 260,
          overflowY: "auto",
          border: `1px solid ${C.line}`,
          borderRadius: 10,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: C.paper,
        }}
      >
        {chatLog.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.from === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              background: m.from === "user" ? C.teal : m.tone === "risk" ? C.riskTint : "#fff",
              color: m.from === "user" ? "#fff" : m.tone === "risk" ? C.risk : C.ink,
              border: m.from === "bot" ? `1px solid ${C.line}` : "none",
              borderRadius: 10,
              padding: "9px 12px",
              fontSize: 13.5,
              lineHeight: 1.45,
            }}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          className={inputClass}
          style={{ ...inputStyle, flex: 1 }}
          value={input}
          placeholder={t("patient.typeMessage", lang)}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button variant="secondary" onClick={send}>{t("patient.send", lang)}</Button>
      </div>
      <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 8 }}>{t("safety.automationNote", lang)}</div>
      <StepFooter lang={lang} onBack={onBack} onNext={onBook} />
    </div>
  );
}

function SummaryCard({ lang, form, files, risk }) {
  const svc = SERVICES.find((s) => s.id === form.service);
  const branch = BRANCHES.find((b) => b.id === form.branch);
  return (
    <Card style={{ position: "sticky", top: 90 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.tealDark, marginBottom: 12 }}>
        {lang === "en" ? "Booking summary" : "Muhtasari wa Miadi"}
      </div>
      <SummaryRow label={t("patient.chooseService", lang)} value={svc ? (lang === "en" ? svc.en : svc.sw) : "—"} />
      <SummaryRow label={t("patient.branch", lang)} value={branch ? (lang === "en" ? branch.en : branch.sw) : "—"} />
      <SummaryRow label={t("patient.slot", lang)} value={form.slot || "—"} />
      <SummaryRow label={t("patient.fullName", lang)} value={form.name || "—"} />
      <SummaryRow label={t("patient.price", lang)} value={svc ? fmtTZS(svc.price) : "—"} />
      <SummaryRow label={lang === "en" ? "Files" : "Faili"} value={String(files.length)} />
      {risk && (
        <div style={{ marginTop: 8 }}>
          {risk === "review" ? <Pill tone="risk">{t("common.riskReview", lang)}</Pill> : <Pill tone="success">{t("common.riskLow", lang)}</Pill>}
        </div>
      )}
    </Card>
  );
}
function SummaryRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
      <span style={{ color: C.inkSoft }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function ConfirmationCard({ lang, form, risk, onReset }) {
  const svc = SERVICES.find((s) => s.id === form.service);
  const branch = BRANCHES.find((b) => b.id === form.branch);
  const doc = DOCTORS.find((d) => d.service === form.service);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div
          className="nlm-pop"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: risk === "review" ? C.amberTint : C.successTint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {risk === "review" ? "⏳" : "✓"}
        </div>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 19, fontWeight: 700, color: C.tealDark }}>
          {risk === "review" ? t("safety.humanReview", lang) : t("patient.confirmTitle", lang)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <InfoBlock label={t("patient.doctor", lang)} value={doc?.name || "—"} />
        <InfoBlock label={t("patient.branch", lang)} value={branch ? (lang === "en" ? branch.en : branch.sw) : "—"} />
        <InfoBlock label={t("patient.slot", lang)} value={form.slot} />
        <InfoBlock label={t("patient.price", lang)} value={svc ? fmtTZS(svc.price) : "—"} />
      </div>
      {risk === "review" && (
        <div style={{ marginBottom: 12 }}>
          <Pill tone="risk">{t("safety.humanReview", lang)}</Pill>
        </div>
      )}
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{t("patient.nextSteps", lang)}</div>
      <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.6, marginBottom: 18 }}>{t("patient.nextStepsBody", lang)}</div>
      <Button variant="secondary" onClick={onReset}>{t("nav.reset", lang)}</Button>
    </div>
  );
}
function InfoBlock({ label, value }) {
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 9, padding: "9px 12px" }}>
      <div style={{ fontSize: 11, color: C.inkSoft, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{value}</div>
    </div>
  );
}

/* ============================================================
   STAFF VIEW
   ============================================================ */
function StaffView({ lang, cases, updateCase }) {
  const [selectedId, setSelectedId] = useState(cases[0]?.id || null);
  useEffect(() => {
    if (!cases.find((c) => c.id === selectedId)) setSelectedId(cases[0]?.id || null);
  }, [cases, selectedId]);

  const selected = cases.find((c) => c.id === selectedId);
  const queueAll = cases;
  const queueEscalated = cases.filter((c) => c.risk === "review" && !c.reviewed);

  return (
    <div>
      <WorkflowBoard lang={lang} activeIndex={selected?.bookingStatus === "confirmed" ? 4 : 3} />
      <div style={{ display: "grid", gridTemplateColumns: "300px minmax(0,1fr)", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card padded={false}>
            <div style={{ padding: "14px 16px 8px", fontSize: 13.5, fontWeight: 700, color: C.tealDark }}>
              {t("staff.incoming", lang)}
            </div>
            <CaseList lang={lang} cases={queueAll} selectedId={selectedId} onSelect={setSelectedId} />
          </Card>
          <Card padded={false}>
            <div style={{ padding: "14px 16px 8px", fontSize: 13.5, fontWeight: 700, color: C.risk }}>
              {t("staff.escalation", lang)}
            </div>
            {queueEscalated.length === 0 ? (
              <div style={{ padding: "10px 16px 16px", fontSize: 12.5, color: C.inkSoft }}>{t("staff.noCases", lang)}</div>
            ) : (
              <CaseList lang={lang} cases={queueEscalated} selectedId={selectedId} onSelect={setSelectedId} />
            )}
          </Card>
          <SourceOfTruthCard lang={lang} />
        </div>

        <div>
          {selected ? (
            <IntakePacket lang={lang} c={selected} onUpdate={(patch) => updateCase(selected.id, patch)} />
          ) : (
            <Card>
              <div style={{ fontSize: 13.5, color: C.inkSoft }}>{t("staff.noCases", lang)}</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function CaseList({ lang, cases, selectedId, onSelect }) {
  return (
    <div>
      {cases.map((c) => {
        const svc = SERVICES.find((s) => s.id === c.service);
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              border: "none",
              borderTop: `1px solid ${C.line}`,
              background: selectedId === c.id ? C.tealTint : "transparent",
              padding: "11px 16px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name}</span>
              {c.risk === "review" ? <Pill tone="risk">!</Pill> : <Pill tone="success">✓</Pill>}
            </div>
            <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>
              {svc ? (lang === "en" ? svc.en : svc.sw) : c.service} • {c.slot}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function IntakePacket({ lang, c, onUpdate }) {
  const svc = SERVICES.find((s) => s.id === c.service);
  const branch = BRANCHES.find((b) => b.id === c.branch);
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: C.tealDark }}>{c.name}</div>
          <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>{c.phone}</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {c.risk === "review" ? <Pill tone="risk">{t("common.riskReview", lang)}</Pill> : <Pill tone="success">{t("common.riskLow", lang)}</Pill>}
          {c.bookingStatus === "confirmed" ? (
            <Pill tone="success">{t("common.confirmed", lang)}</Pill>
          ) : (
            <Pill tone="amber">{t("common.pending", lang)}</Pill>
          )}
        </div>
      </div>

      <PacketSection title={t("staff.serviceSelected", lang)}>
        {svc ? (lang === "en" ? svc.en : svc.sw) : c.service} — {c.doctor || DOCTORS.find((d) => d.service === c.service)?.name}
      </PacketSection>

      <PacketSection title={t("staff.branchSlot", lang)}>
        {branch ? (lang === "en" ? branch.en : branch.sw) : c.branch} · {c.slot}
      </PacketSection>

      <PacketSection title={t("staff.patientDetails", lang)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 13 }}>
          <div>{t("patient.ageRange", lang)}: <b>{c.ageRange || "—"}</b></div>
          <div>{t("patient.payment", lang)}: <b>{c.payment || "—"}</b></div>
          <div>{t("patient.channel", lang)}: <b>{c.channel || "—"}</b></div>
        </div>
      </PacketSection>

      <PacketSection title={t("staff.hpiAnswers", lang)}>
        <div style={{ display: "grid", gap: 6 }}>
          {Object.entries(c.hpi || {}).map(([k, v]) => (
            <div key={k} style={{ fontSize: 13 }}>
              <span style={{ color: C.inkSoft }}>{t(`patient.hpi.${k}`, lang).split("—")[0].trim()}:</span> <b>{v || "—"}</b>
            </div>
          ))}
        </div>
      </PacketSection>

      <PacketSection title={t("staff.fileMeta", lang)}>
        {c.files && c.files.length > 0 ? (
          <div style={{ display: "grid", gap: 6 }}>
            {c.files.map((f, i) => (
              <div key={i} style={{ fontSize: 12.5, color: C.inkSoft }}>
                {f.name} • {f.type} • {(f.size / 1024).toFixed(0)} KB
              </div>
            ))}
          </div>
        ) : (
          <span style={{ fontSize: 12.5, color: C.inkSoft }}>—</span>
        )}
      </PacketSection>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
        <Button onClick={() => onUpdate({ bookingStatus: "confirmed" })} disabled={c.bookingStatus === "confirmed"}>
          {t("staff.confirmBooking", lang)}
        </Button>
        <Button variant="secondary" onClick={() => onUpdate({ bookingStatus: "callback" })}>
          {t("staff.requestCallback", lang)}
        </Button>
        <Button variant="secondary" onClick={() => onUpdate({ reviewed: true, risk: "low" })} disabled={c.reviewed}>
          {t("staff.markReviewed", lang)}
        </Button>
        <Button variant="ghost" onClick={() => onUpdate({ followupSent: true })}>
          {t("staff.sendFollowup", lang)}
        </Button>
      </div>
      <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 12 }}>{t("safety.automationNote", lang)}</div>
    </Card>
  );
}

function PacketSection({ title, children }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 5, textTransform: "none" }}>{title}</div>
      <div style={{ fontSize: 13.5 }}>{children}</div>
    </div>
  );
}

function SourceOfTruthCard({ lang }) {
  return (
    <Card>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.tealDark, marginBottom: 10 }}>{t("staff.sourceOfTruth", lang)}</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 4 }}>{t("staff.approvedServices", lang)}</div>
      <div style={{ fontSize: 12.5, marginBottom: 10 }}>{SERVICES.map((s) => (lang === "en" ? s.en : s.sw)).join(", ")}</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 4 }}>{t("staff.doctorsOnDuty", lang)}</div>
      <div style={{ fontSize: 12.5, marginBottom: 10 }}>{DOCTORS.length} {lang === "en" ? "active" : "wanaofanya kazi"}</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 4 }}>{t("staff.branchCapacity", lang)}</div>
      <div style={{ display: "grid", gap: 6, marginTop: 6 }}>
        {BRANCH_CAPACITY.map((b) => {
          const branch = BRANCHES.find((x) => x.id === b.id);
          return (
            <div key={b.id}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                <span>{branch ? (lang === "en" ? branch.en : branch.sw) : b.id}</span>
                <span>{b.used}%</span>
              </div>
              <Bar value={b.used} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Bar({ value, tone = C.teal, max = 100 }) {
  return (
    <div style={{ height: 6, borderRadius: 4, background: C.line, overflow: "hidden", marginTop: 2 }}>
      <div style={{ height: "100%", width: `${Math.min(100, (value / max) * 100)}%`, background: tone, borderRadius: 4 }} />
    </div>
  );
}

/* ============================================================
   MANAGER VIEW
   ============================================================ */
function ManagerView({ lang, cases }) {
  const escalations = cases.filter((c) => c.risk === "review").length;
  const confirmed = cases.filter((c) => c.bookingStatus === "confirmed").length;

  const metrics = [
    { key: "totalInquiries", value: DASHBOARD_METRICS.totalInquiries.toLocaleString() },
    { key: "conversion", value: Math.round(DASHBOARD_METRICS.conversion * 100) + "%" },
    { key: "bookings", value: (DASHBOARD_METRICS.bookings + confirmed).toLocaleString() },
    { key: "recovered", value: DASHBOARD_METRICS.recovered },
    { key: "attendance", value: "+" + Math.round(DASHBOARD_METRICS.attendance * 100) + "%" },
    { key: "workloadSaved", value: DASHBOARD_METRICS.workloadSaved },
    { key: "revenue", value: DASHBOARD_METRICS.revenue },
    { key: "escalations", value: DASHBOARD_METRICS.escalations + escalations },
  ];

  const maxFunnel = FUNNEL[0].value;
  const maxDemand = Math.max(...DEMAND.map((d) => d.value));

  return (
    <div>
      <WorkflowBoard lang={lang} activeIndex={5} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: C.tealDark, letterSpacing: "-0.01em" }}>{t("manager.dashboard", lang)}</div>
        <Pill tone="amber">{t("manager.mockNote", lang)}</Pill>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px,1fr))", gap: 12, marginBottom: 20 }}>
        {metrics.map((m) => (
          <Card key={m.key} style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: C.inkSoft }}>{t(`manager.${m.key}`, lang)}</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 25, fontWeight: 700, color: C.tealDark, marginTop: 6 }}>{m.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.tealDark, marginBottom: 14 }}>{t("manager.funnel", lang)}</div>
          <div style={{ display: "grid", gap: 10 }}>
            {FUNNEL.map((f) => (
              <div key={f.en}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 3 }}>
                  <span>{lang === "en" ? f.en : f.sw}</span>
                  <span style={{ fontWeight: 700 }}>{f.value.toLocaleString()}</span>
                </div>
                <Bar value={f.value} max={maxFunnel} tone={C.blue} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.tealDark, marginBottom: 14 }}>{t("manager.demand", lang)}</div>
          <div style={{ display: "grid", gap: 9 }}>
            {DEMAND.map((d) => {
              const svc = SERVICES.find((s) => s.id === d.id);
              return (
                <div key={d.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span>{svc ? (lang === "en" ? svc.en : svc.sw) : d.id}</span>
                    <span style={{ fontWeight: 700 }}>{d.value}</span>
                  </div>
                  <Bar value={d.value} max={maxDemand} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.tealDark, marginBottom: 14 }}>{t("manager.branchView", lang)}</div>
          <div style={{ display: "grid", gap: 10 }}>
            {BRANCH_CAPACITY.map((b) => {
              const branch = BRANCHES.find((x) => x.id === b.id);
              return (
                <div key={b.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                    <span>{branch ? (lang === "en" ? branch.en : branch.sw) : b.id}</span>
                    <span style={{ fontWeight: 700 }}>{b.used}%</span>
                  </div>
                  <Bar value={b.used} tone={b.used > 85 ? C.amber : C.teal} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.tealDark, marginBottom: 14 }}>{t("manager.workloadSummary", lang)}</div>
          <div style={{ display: "grid", gap: 12 }}>
            {STAFF_WORKLOAD.map((w) => (
              <div key={w.name}>
                <div style={{ fontSize: 12.5, marginBottom: 3 }}>{w.name}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <div style={{ flex: 1 }}><Bar value={w.after} tone={C.success} /></div>
                  <span style={{ fontSize: 11.5, color: C.inkSoft, width: 70, textAlign: "right" }}>
                    -{100 - w.after}% {lang === "en" ? "load" : "mzigo"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 12.5, color: C.inkSoft }}>{t("manager.recoveryPerf", lang)}: <b style={{ color: C.ink }}>{DASHBOARD_METRICS.recovered} {lang === "en" ? "bookings/mo" : "miadi/mwezi"}</b></div>
        </Card>
      </div>
    </div>
  );
}


