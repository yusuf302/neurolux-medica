"use client";

import { useEffect, useMemo, useState } from "react";
import { branches, services } from "@/lib/mock-data";
import { getStoredCases, resetDemoCases, type DemoCase } from "@/lib/demo-store";

export function ManagerDashboard() {
  const [items, setItems] = useState<DemoCase[]>([]);

  useEffect(() => {
    function load() {
      setItems(getStoredCases());
    }
    load();
    window.addEventListener("neurolux-cases-updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("neurolux-cases-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const metrics = useMemo(() => {
    const confirmed = items.filter((item) => item.status === "confirmed").length;
    const reviews = items.filter((item) => item.risk === "human_review_required").length;
    const hpiComplete = items.filter((item) => item.hpi.length === 7).length;
    const revenue = items.reduce((sum, item) => {
      const service = services.find((serviceItem) => serviceItem.id === item.serviceId);
      return sum + (item.status === "confirmed" || item.status === "pending_payment" ? service?.priceTzs ?? 0 : 0);
    }, 0);
    return [
      ["Patient cases", String(items.length)],
      ["History of Presenting Illness complete", String(hpiComplete)],
      ["Bookings confirmed", String(confirmed)],
      ["Human reviews", String(reviews)],
      ["Revenue influenced", `TZS ${revenue.toLocaleString()}`],
      ["Attendance forecast", `${Math.min(92, 70 + confirmed * 6)}%`],
    ];
  }, [items]);

  const branchCounts = branches.map((branch) => ({
    branch,
    count: items.filter((item) => item.branchId === branch.id).length,
  }));

  return (
    <>
      <section className="topline">
        <strong>Manager dashboard</strong>
        <button className="secondary" onClick={resetDemoCases} type="button">Reset demo data</button>
      </section>
      <section className="grid">
        <article className="panel span-8">
          <div className="panel-head">
            <p className="eyebrow">Live operational view</p>
            <h2>Metrics update from patient and staff activity</h2>
            <span>This turns the prototype into a sellable story: every patient interaction becomes visible work, revenue, and safety data.</span>
          </div>
          <div className="content">
            <div className="proof">
              {metrics.map(([label, value]) => (
                <div className="metric" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Revenue leakage</p>
            <h2>Demand funnel</h2>
          </div>
          <div className="content">
            {[
              ["Started intake", items.length],
              ["History of Presenting Illness complete", items.filter((item) => item.hpi.length === 7).length],
              ["Slot reserved", items.filter((item) => item.status === "pending_payment" || item.status === "confirmed").length],
              ["Confirmed", items.filter((item) => item.status === "confirmed").length],
            ].map(([label, value]) => (
              <div className="funnel-row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Branch pressure</p>
            <h2>Where demand is landing</h2>
          </div>
          <div className="content">
            {branchCounts.map(({ branch, count }) => (
              <div className="card" key={branch.id}>
                <strong>{branch.name}</strong>
                <p>{count} active cases - current wait {branch.waitTime}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Safety</p>
            <h2>Escalation reasons</h2>
          </div>
          <div className="content">
            <div className="card warn"><strong>Human review required</strong><p>{items.filter((item) => item.risk === "human_review_required").length} cases</p></div>
            <div className="card success"><strong>Routine automation</strong><p>{items.filter((item) => item.risk !== "human_review_required").length} cases</p></div>
          </div>
        </article>

        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Recent cases</p>
            <h2>Latest patient activity</h2>
          </div>
          <div className="content">
            {items.slice(0, 4).map((item) => (
              <div className="card" key={item.id}>
                <strong>{item.patientName}</strong>
                <p>{item.status.replaceAll("_", " ")} - {item.risk.replaceAll("_", " ")}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
