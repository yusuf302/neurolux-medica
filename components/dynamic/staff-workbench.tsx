"use client";

import { useEffect, useMemo, useState } from "react";
import { branches, providers, services, slots } from "@/lib/mock-data";
import { getStoredCases, saveStoredCases, type DemoCase } from "@/lib/demo-store";

export function StaffWorkbench() {
  const [items, setItems] = useState<DemoCase[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    function load() {
      const cases = getStoredCases();
      setItems(cases);
      setActiveId((current) => current || cases[0]?.id || "");
    }
    load();
    window.addEventListener("neurolux-cases-updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("neurolux-cases-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const active = items.find((item) => item.id === activeId) ?? items[0];
  const service = services.find((item) => item.id === active?.serviceId);
  const branch = branches.find((item) => item.id === active?.branchId);
  const provider = providers.find((item) => item.id === active?.providerId);
  const slot = slots.find((item) => item.id === active?.slotId);
  const urgentCount = items.filter((item) => item.risk === "human_review_required").length;

  const ordered = useMemo(
    () => [...items].sort((a, b) => Number(b.risk === "human_review_required") - Number(a.risk === "human_review_required")),
    [items],
  );

  function updateStatus(status: DemoCase["status"]) {
    if (!active) return;
    const next = items.map((item) =>
      item.id === active.id
        ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
            messages: [...item.messages, { speaker: "staff" as const, text: `Staff updated this case to ${status.replaceAll("_", " ")}.` }],
          }
        : item,
    );
    setItems(next);
    saveStoredCases(next);
  }

  return (
    <>
      <section className="topline">
        <strong>Staff workbench</strong>
        <span className={urgentCount ? "status warn" : "status"}>{urgentCount} human review cases</span>
      </section>
      <section className="grid">
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Live case inbox</p>
            <h2>Patient submissions</h2>
            <span>Cases created from the patient dashboard appear here automatically in this browser demo.</span>
          </div>
          <div className="content case-list">
            {ordered.map((item) => (
              <button className={item.id === active?.id ? "case-button active" : "case-button"} key={item.id} onClick={() => setActiveId(item.id)} type="button">
                <span className={item.risk === "human_review_required" ? "status warn" : "status"}>{item.status.replaceAll("_", " ")}</span>
                <strong>{item.patientName}</strong>
                <small>{item.phone}</small>
                <small>{item.risk === "human_review_required" ? "Escalated by NeuroLux" : "Ready for booking workflow"}</small>
              </button>
            ))}
          </div>
        </article>

        <article className="panel span-5">
          <div className="panel-head">
            <p className="eyebrow">Intake packet</p>
            <h2>{active?.patientName ?? "No active case"}</h2>
            <span>History of Presenting Illness answers, service request, file metadata, and routing reason.</span>
          </div>
          {active ? (
            <div className="content">
              <div className="two-col">
                <div className="card"><strong>Service</strong><p>{service?.name}</p></div>
                <div className="card"><strong>Branch</strong><p>{branch?.name}</p></div>
                <div className="card"><strong>Provider</strong><p>{provider?.name}</p></div>
                <div className="card"><strong>Slot</strong><p>{slot?.label}</p></div>
                <div className="card"><strong>File</strong><p>{active.file ? `${active.file.name} - ${active.file.size}` : "No file selected"}</p></div>
                <div className={active.risk === "human_review_required" ? "card warn" : "card success"}><strong>AI routing</strong><p>{active.risk.replaceAll("_", " ")}</p></div>
              </div>
              <div className="hpi-list">
                {active.hpi.map((answer) => (
                  <div className="card success" key={answer.field}>
                    <strong>{answer.label}</strong>
                    <p>{answer.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        <article className="panel span-3">
          <div className="panel-head">
            <p className="eyebrow">Staff actions</p>
            <h2>Move the case</h2>
          </div>
          <div className="content">
            <button className="primary" onClick={() => updateStatus("confirmed")} type="button">Confirm booking</button>
            <button className="secondary" onClick={() => updateStatus("pending_review")} type="button">Request callback</button>
            <button className="danger" onClick={() => updateStatus("pending_review")} type="button">Escalate to clinician</button>
            <div className="card warn">
              <strong>No diagnosis or treatment advice</strong>
              <p>Staff receives the intake packet. NeuroLux only supports access, routing, and review workflow.</p>
            </div>
          </div>
        </article>

        <article className="panel span-12">
          <div className="panel-head">
            <p className="eyebrow">Conversation history</p>
            <h2>What the patient and AI receptionist exchanged</h2>
          </div>
          <div className="content">
            <div className="chat compact-chat">
              {(active?.messages ?? []).map((message, index) => (
                <div className={message.speaker === "patient" ? "bubble patient" : message.speaker === "staff" ? "bubble staff" : "bubble system"} key={`${message.speaker}-${index}`}>
                  <small>{message.speaker}</small>
                  <span>{message.text}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
