import { useMemo, useState } from "react";

const services = {
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
};

const modes = {
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
};

const stageLabels = ["Capture", "Understand", "Verify", "Act", "Follow up", "Measure"];

function makeConversation(mode, service, urgency) {
  const risky = mode === "escalate" || urgency === "clinical-risk";
  if (risky) {
    return [
      ["Patient", `I need help with ${service.fullName.toLowerCase()}, but I also have chest pain and trouble breathing.`],
      ["NeuroLux", "I cannot safely assess those symptoms by chat. I am alerting the clinic team now and advising urgent medical attention according to clinic policy."],
      ["Clinical desk", `High-priority case opened for ${service.branch}. Staff receive the patient request, service context, and callback need.`],
    ];
  }

  if (mode === "recover") {
    return [
      ["Patient", `I started booking ${service.fullName.toLowerCase()} but did not finish.`],
      ["NeuroLux", `The ${service.slot} slot is still available at ${service.branch}. Would you like me to reserve it?`],
      ["Patient", "Yes, please reserve it."],
      ["NeuroLux", `Confirmed with ${service.doctor}. A reminder is scheduled, and this is marked as recovered demand.`],
    ];
  }

  if (mode === "manager") {
    return [
      ["Operations lead", "Show me where patient demand is leaking this week."],
      ["NeuroLux", "Most leakage is happening after inquiry qualification and before appointment confirmation."],
      ["NeuroLux", `${service.fullName} has the strongest recovery opportunity because ${service.downstream.toLowerCase()} can be triggered after booking.`],
    ];
  }

  return [
    ["Patient", `Hi, do you have ${service.fullName.toLowerCase()} available soon?`],
    ["NeuroLux", `Yes. ${service.fullName} is available ${service.slot} with ${service.doctor} at ${service.branch}.`],
    ["Patient", "Can you book that for me and send the details?"],
    ["NeuroLux", `Booked. The approved price is ${service.price}. Confirmation, location, and reminder are ready.`],
  ];
}

function makeMetrics(mode) {
  if (mode === "recover") return { inquiries: 184, bookings: 58, recovered: 21, attendance: "82%", value: "TZS 7.4M" };
  if (mode === "escalate") return { inquiries: 171, bookings: 49, recovered: 13, attendance: "79%", value: "Trust protected" };
  if (mode === "manager") return { inquiries: 312, bookings: 96, recovered: 34, attendance: "86%", value: "TZS 18.6M" };
  return { inquiries: 166, bookings: 54, recovered: 12, attendance: "81%", value: "TZS 5.8M" };
}

export default function App() {
  const [mode, setMode] = useState("book");
  const [serviceKey, setServiceKey] = useState("cardiology");
  const [urgency, setUrgency] = useState("normal");
  const [branch, setBranch] = useState("primary");
  const [step, setStep] = useState(3);

  const service = services[serviceKey];
  const selectedMode = modes[mode];
  const risky = mode === "escalate" || urgency === "clinical-risk";
  const conversation = useMemo(() => makeConversation(mode, service, urgency), [mode, service, urgency]);
  const metrics = makeMetrics(mode);
  const visibleMessages = conversation.slice(0, Math.min(conversation.length, step + 1));

  function chooseMode(nextMode) {
    setMode(nextMode);
    setStep(nextMode === "manager" ? 4 : 2);
  }

  function runNextStep() {
    setStep((current) => (current >= stageLabels.length - 1 ? 0 : current + 1));
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="brand-mark">NL</div>
          <p className="eyebrow">NeuroLux Medica</p>
          <h1>Patient-access infrastructure for clinics that cannot afford to lose demand.</h1>
          <p>
            A complete prototype of the AI receptionist, verified appointment workflow, recovery engine,
            escalation queue, and management dashboard that turns patient interest into measurable care activity.
          </p>
        </div>
        <div className="hero-proof">
          <div><span>Average first reply</span><strong>8 sec</strong></div>
          <div><span>Weekly recovered demand</span><strong>34 patients</strong></div>
          <div><span>Mock value influenced</span><strong>TZS 18.6M</strong></div>
        </div>
      </section>

      <section className="mode-bar" aria-label="Demo modes">
        {Object.entries(modes).map(([key, item]) => (
          <button className={mode === key ? "active" : ""} key={key} onClick={() => chooseMode(key)}>
            <span>{item.label}</span>
            <small>{item.outcome}</small>
          </button>
        ))}
      </section>

      <section className="product-grid">
        <aside className="panel controls">
          <div className="panel-head">
            <p className="eyebrow">Demo builder</p>
            <h2>Shape the clinic case</h2>
          </div>
          <label>
            Service line
            <select value={serviceKey} onChange={(event) => setServiceKey(event.target.value)}>
              {Object.entries(services).map(([key, item]) => <option key={key} value={key}>{item.fullName}</option>)}
            </select>
          </label>
          <label>
            Patient risk
            <select value={urgency} onChange={(event) => setUrgency(event.target.value)}>
              <option value="normal">Routine access request</option>
              <option value="same-day">Same-day pressure</option>
              <option value="clinical-risk">Clinical-risk wording</option>
              <option value="low-confidence">Unclear request</option>
            </select>
          </label>
          <label>
            Deployment branch
            <select value={branch} onChange={(event) => setBranch(event.target.value)}>
              <option value="primary">Primary clinic branch</option>
              <option value="specialist">Specialist wing</option>
              <option value="diagnostic">Diagnostics center</option>
            </select>
          </label>
          <button className="run-button" onClick={runNextStep}>Run next workflow step</button>
          <div className="mode-intent">
            <strong>{selectedMode.headline}</strong>
            <span>{selectedMode.intent}</span>
          </div>
        </aside>

        <section className="center-stage">
          <article className="panel conversation-card">
            <div className="panel-head row">
              <div>
                <p className="eyebrow">AI receptionist</p>
                <h2>Verified patient conversation</h2>
              </div>
              <span className={`status ${selectedMode.accent}`}>{risky ? "Human review required" : "Ready to book"}</span>
            </div>
            <div className="phone-frame">
              {visibleMessages.map(([speaker, text], index) => (
                <div className={`bubble ${speaker === "Patient" || speaker === "Operations lead" ? "patient" : speaker === "Clinical desk" ? "staff" : "system"}`} key={`${speaker}-${index}`}>
                  <small>{speaker}</small>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel workflow-card">
            <div className="panel-head row">
              <div>
                <p className="eyebrow">Clinic workflow</p>
                <h2>From inquiry to measurable outcome</h2>
              </div>
              <span className="status green">Step {step + 1} of 6</span>
            </div>
            <div className="workflow-board">
              {stageLabels.map((label, index) => (
                <div className={index <= step ? "workflow-step done" : "workflow-step"} key={label}>
                  <span>{index + 1}</span>
                  <strong>{label}</strong>
                  <small>{index <= step ? "Complete" : "Waiting"}</small>
                </div>
              ))}
            </div>
          </article>
        </section>

        <aside className="right-stage">
          <article className="panel appointment">
            <div className="panel-head">
              <p className="eyebrow">Appointment engine</p>
              <h2>{risky ? "Paused for safety" : service.fullName}</h2>
            </div>
            <dl>
              <div><dt>Clinician</dt><dd>{risky ? "Clinical desk" : service.doctor}</dd></div>
              <div><dt>Slot</dt><dd>{risky ? "Immediate callback" : service.slot}</dd></div>
              <div><dt>Branch</dt><dd>{branch === "primary" ? service.branch : branch === "specialist" ? "Specialist wing" : "Diagnostics center"}</dd></div>
              <div><dt>Approved price</dt><dd>{risky ? "Staff confirms" : service.price}</dd></div>
            </dl>
            <div className="truth-box">Truth comes from approved clinic data, not model memory.</div>
          </article>

          <article className="panel dashboard">
            <div className="panel-head">
              <p className="eyebrow">Executive dashboard</p>
              <h2>Impact snapshot</h2>
            </div>
            <div className="metrics">
              <div><span>Inquiries</span><strong>{metrics.inquiries}</strong></div>
              <div><span>Bookings</span><strong>{metrics.bookings}</strong></div>
              <div><span>Recovered</span><strong>{metrics.recovered}</strong></div>
              <div><span>Attendance</span><strong>{metrics.attendance}</strong></div>
            </div>
            <div className="value-card">
              <span>Revenue influenced</span>
              <strong>{metrics.value}</strong>
              <small>Mock estimate for demo only</small>
            </div>
          </article>

          <article className="panel escalation">
            <div className="panel-head">
              <p className="eyebrow">Safety center</p>
              <h2>{risky ? "Escalation active" : "Exceptions monitored"}</h2>
            </div>
            <div className={risky ? "alert active" : "alert"}>
              {risky
                ? "Clinical-risk or low-confidence language detected. Automation stops, staff are alerted, and the patient receives safe routing."
                : "Routine case. Staff only see exceptions, insurance checks, and follow-up needs."}
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
