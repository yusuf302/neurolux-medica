"use client";

import { useEffect, useMemo, useState } from "react";
import { branches, hpiQuestions, providers, services, slots } from "@/lib/mock-data";
import {
  createCase,
  getStoredCases,
  getStoredUser,
  saveStoredCases,
  saveStoredUser,
  type DemoCase,
  type DemoUser,
  type IntakeDraft,
} from "@/lib/demo-store";
import type { Language } from "@/lib/types";

const starterDraft: IntakeDraft = {
  serviceId: "cardiology",
  branchId: "oysterbay",
  urgency: "routine",
  hpi: {},
  notes: "",
};

export function PatientFlow() {
  const [language, setLanguage] = useState<Language>("en");
  const [user, setUser] = useState<DemoUser | null>(null);
  const [login, setLogin] = useState({ name: "", email: "", phone: "" });
  const [draft, setDraft] = useState<IntakeDraft>(starterDraft);
  const [caseItem, setCaseItem] = useState<DemoCase | null>(null);
  const [step, setStep] = useState(0);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const saved = getStoredUser();
    if (saved?.role === "patient") {
      setUser(saved);
      setLogin({ name: saved.name, email: saved.email, phone: saved.phone });
    }
    const savedLang = window.localStorage.getItem("neurolux.language");
    if (savedLang === "sw" || savedLang === "en") setLanguage(savedLang);
  }, []);

  const service = services.find((item) => item.id === draft.serviceId) ?? services[0];
  const branch = branches.find((item) => item.id === draft.branchId) ?? branches[0];
  const provider = providers.find((item) => item.serviceId === service.id && item.branchId === branch.id) ?? providers[0];
  const slot = slots.find((item) => item.branchId === branch.id && item.status === "available") ?? slots[0];
  const hpiComplete = hpiQuestions.filter((item) => draft.hpi[item.field]?.trim()).length;
  const progress = Math.round((hpiComplete / hpiQuestions.length) * 100);
  const canSubmit = Boolean(user && hpiComplete === 7 && draft.notes.trim());

  const workflow = useMemo(
    () => [
      ["Login", Boolean(user)],
      ["Choose service", Boolean(draft.serviceId && draft.branchId)],
      ["History of Presenting Illness", hpiComplete === 7],
      ["AI safety review", Boolean(caseItem)],
      ["Booking or escalation", Boolean(caseItem)],
    ],
    [caseItem, draft.branchId, draft.serviceId, hpiComplete, user],
  );

  function persistLanguage(next: Language) {
    setLanguage(next);
    window.localStorage.setItem("neurolux.language", next);
  }

  function handleLogin() {
    const nextUser: DemoUser = {
      name: login.name.trim() || "Demo Patient",
      email: login.email.trim() || "patient@example.com",
      phone: login.phone.trim() || "+255 700 000 000",
      role: "patient",
    };
    saveStoredUser(nextUser);
    setUser(nextUser);
    setStep(1);
  }

  function handleFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setDraft((current) => ({
      ...current,
      file: {
        name: file.name,
        type: file.type || "unknown",
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        status: "metadata_only",
      },
    }));
  }

  function runAiReview() {
    if (!user) return;
    const nextCase = createCase(user, draft, language);
    const cases = [nextCase, ...getStoredCases().filter((item) => item.id !== nextCase.id)];
    saveStoredCases(cases);
    setCaseItem(nextCase);
    setStep(4);
  }

  function askChat() {
    if (!chatInput.trim()) return;
    const riskWords = ["diagnose", "treat", "medicine", "dawa", "matibabu", "utambuzi"];
    const risky = riskWords.some((word) => chatInput.toLowerCase().includes(word));
    const answer = risky
      ? "NeuroLux cannot diagnose, prescribe, or give treatment advice. I can capture approved intake details and route this to staff."
      : `NeuroLux can help with service access, booking, branch selection, prices, and the seven History of Presenting Illness questions for ${service.name}.`;
    setCaseItem((current) =>
      current
        ? {
            ...current,
            messages: [
              ...current.messages,
              { speaker: "patient", text: chatInput },
              { speaker: "neurolux", text: answer },
            ],
          }
        : current,
    );
    setChatInput("");
  }

  return (
    <>
      <section className="topline">
        <strong>{user ? `${user.name}'s patient dashboard` : "Patient demo login"}</strong>
        <div className="language" aria-label="Language">
          <button className={language === "en" ? "active" : ""} onClick={() => persistLanguage("en")} type="button">English</button>
          <button className={language === "sw" ? "active" : ""} onClick={() => persistLanguage("sw")} type="button">Kiswahili</button>
        </div>
      </section>

      <section className="grid">
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Dynamic patient access</p>
            <h2>Login, intake, booking, and safe AI routing</h2>
            <span>Demo login uses name, email, and phone only. No password is needed for this sales version.</span>
          </div>
          <div className="content">
            {!user ? (
              <>
                <label className="field"><span>Full name</span><input value={login.name} onChange={(event) => setLogin({ ...login, name: event.target.value })} placeholder="Amina Juma" /></label>
                <label className="field"><span>Email</span><input value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} placeholder="amina@example.com" /></label>
                <label className="field"><span>Phone number</span><input value={login.phone} onChange={(event) => setLogin({ ...login, phone: event.target.value })} placeholder="+255 712 456 900" /></label>
                <button className="primary" onClick={handleLogin} type="button">Enter patient dashboard</button>
              </>
            ) : (
              <>
                <div className="card success">
                  <strong>{user.name}</strong>
                  <p>{user.email} - {user.phone}</p>
                </div>
                <button className="secondary" onClick={() => { setUser(null); setCaseItem(null); setStep(0); }} type="button">Start as another patient</button>
              </>
            )}
          </div>
        </article>

        <article className="panel span-8">
          <div className="panel-head">
            <p className="eyebrow">Workflow</p>
            <h2>Every answer moves the case forward</h2>
          </div>
          <div className="content">
            <div className="workflow">
              {workflow.map(([label, done], index) => (
                <div className={done ? "flow-step done" : index === step ? "flow-step active" : "flow-step"} key={label as string}>
                  <span>{index + 1}</span>
                  <strong>{label}</strong>
                  <small>{done ? "Complete" : "Waiting"}</small>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Service request</p>
            <h2>Choose what the patient needs</h2>
          </div>
          <div className="content">
            <label className="field">
              <span>Service</span>
              <select value={draft.serviceId} onChange={(event) => setDraft({ ...draft, serviceId: event.target.value })}>
                {services.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Branch</span>
              <select value={draft.branchId} onChange={(event) => setDraft({ ...draft, branchId: event.target.value })}>
                {branches.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Urgency</span>
              <select value={draft.urgency} onChange={(event) => setDraft({ ...draft, urgency: event.target.value as IntakeDraft["urgency"] })}>
                <option value="routine">Routine</option>
                <option value="same_day">Same day</option>
                <option value="urgent">Urgent or unclear</option>
              </select>
            </label>
            <label className="field">
              <span>Optional PDF or image</span>
              <input accept="application/pdf,image/png,image/jpeg" onChange={(event) => handleFile(event.target.files)} type="file" />
            </label>
            {draft.file ? <div className="card"><strong>{draft.file.name}</strong><p>{draft.file.type} - {draft.file.size} - not uploaded in demo</p></div> : null}
          </div>
        </article>

        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">History of Presenting Illness</p>
            <h2>Seven approved questions only</h2>
            <span>{progress}% complete</span>
          </div>
          <div className="content">
            {hpiQuestions.map((item) => (
              <label className="field compact" key={item.field}>
                <span>{item.label}</span>
                <textarea
                  value={draft.hpi[item.field] ?? ""}
                  onChange={(event) => setDraft({ ...draft, hpi: { ...draft.hpi, [item.field]: event.target.value } })}
                  placeholder={item.question}
                />
              </label>
            ))}
          </div>
        </article>

        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">AI receptionist</p>
            <h2>Safe response and routing</h2>
          </div>
          <div className="content">
            <label className="field">
              <span>Patient message or question</span>
              <textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="I want to book tomorrow morning..." />
            </label>
            <button className="primary" disabled={!canSubmit} onClick={runAiReview} type="button">Create live case</button>
            <div className="card warn">
              <strong>Safety boundary</strong>
              <p>NeuroLux collects access details and History of Presenting Illness information only. It does not provide diagnosis or treatment advice.</p>
            </div>
          </div>
        </article>

        <article className="panel span-7">
          <div className="panel-head">
            <p className="eyebrow">Live conversation</p>
            <h2>{caseItem ? "Generated from patient answers" : "Waiting for intake"}</h2>
          </div>
          <div className="content">
            <div className="chat">
              {(caseItem?.messages ?? [
                { speaker: "neurolux" as const, text: "Enter patient details, complete the seven History of Presenting Illness questions, and create a live case." },
              ]).map((message, index) => (
                <div className={message.speaker === "patient" ? "bubble patient" : "bubble system"} key={`${message.speaker}-${index}`}>
                  <small>{message.speaker === "patient" ? "Patient" : "NeuroLux"}</small>
                  <span>{message.text}</span>
                </div>
              ))}
            </div>
            <div className="row">
              <input className="inline-input" value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about booking, price, branch, or safety..." />
              <button className="secondary" disabled={!caseItem} onClick={askChat} type="button">Ask NeuroLux</button>
            </div>
          </div>
        </article>

        <article className="panel span-5">
          <div className="panel-head">
            <p className="eyebrow">Booking result</p>
            <h2>{caseItem?.risk === "human_review_required" ? "Human review required" : "Recommended appointment"}</h2>
          </div>
          <div className="content">
            <div className={caseItem?.risk === "human_review_required" ? "card warn" : "card success"}>
              <strong>{service.name}</strong>
              <p>{provider.name} - {provider.title}</p>
              <p>{branch.name} - {slot.label}</p>
              <p>TZS {service.priceTzs.toLocaleString()}</p>
            </div>
            {caseItem ? (
              <div className="card">
                <strong>Status: {caseItem.status.replaceAll("_", " ")}</strong>
                <p>{caseItem.risk === "human_review_required" ? "Staff can now see this case in the workbench." : "Slot is reserved in the simulated booking engine."}</p>
              </div>
            ) : null}
          </div>
        </article>
      </section>
    </>
  );
}
