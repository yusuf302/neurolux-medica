import { CaseCard } from "@/components/case-card";
import { HpiChecklist } from "@/components/hpi-checklist";
import { auditEvents, cases } from "@/lib/mock-data";

export default function StaffPage() {
  return (
    <>
      <section className="topline">
        <strong>Staff workbench</strong>
        <span className="status warn">2 cases need attention</span>
      </section>
      <section className="grid">
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Case inbox</p>
            <h2>Today&apos;s access queue</h2>
          </div>
          <div className="content case-list">
            {cases.map((item) => <CaseCard key={item.id} patientCase={item} />)}
          </div>
        </article>
        <article className="panel span-5">
          <div className="panel-head">
            <p className="eyebrow">Intake packet</p>
            <h2>Amina Juma</h2>
            <span>Staff sees exactly what was collected, why it was routed, and which source-of-truth fields were used.</span>
          </div>
          <div className="content">
            <div className="two-col">
              <div className="card"><strong>Service</strong><p>Cardiology consultation</p></div>
              <div className="card"><strong>Branch</strong><p>Oysterbay Specialist Centre</p></div>
              <div className="card"><strong>File</strong><p>previous-results.pdf - metadata only</p></div>
              <div className="card"><strong>Source</strong><p>Approved slots, providers, prices</p></div>
            </div>
            <HpiChecklist completed={7} />
          </div>
        </article>
        <article className="panel span-3">
          <div className="panel-head">
            <p className="eyebrow">Actions</p>
            <h2>Human review</h2>
          </div>
          <div className="content">
            <button className="primary" type="button">Confirm booking</button>
            <button className="secondary" type="button">Request callback</button>
            <button className="danger" type="button">Escalate to clinician</button>
            <div className="card warn">
              <strong>Clinical safety</strong>
              <p>Automation stops when risk or uncertainty appears. Staff must review before any clinical next step.</p>
            </div>
          </div>
        </article>
        <article className="panel span-12">
          <div className="panel-head">
            <p className="eyebrow">Audit trail</p>
            <h2>Accountability timeline</h2>
          </div>
          <div className="content">
            <ol className="timeline">
              {auditEvents.map((item) => <li key={item}><strong>{item}</strong><small>Recorded in simulated audit log</small></li>)}
            </ol>
          </div>
        </article>
      </section>
    </>
  );
}
