import Link from "next/link";
import { branches, services } from "@/lib/mock-data";

const metrics = [
  ["First response", "8 sec"],
  ["Recovered demand", "34"],
  ["Attendance lift", "+17%"],
  ["Queue visibility", "Live"],
];

export default function HomePage() {
  return (
    <>
      <section className="topline">
        <strong>Production-ready foundation</strong>
        <div className="language" aria-label="Language preview">
          <button className="active" type="button">English</button>
          <button type="button">Kiswahili</button>
        </div>
      </section>
      <section className="hero">
        <div>
          <p className="eyebrow">Clinic digital front door</p>
          <h1>Turn patient messages into booked, reviewed, and followed-up clinic visits.</h1>
          <p>
            NeuroLux combines bilingual intake, safe HPI capture, booking reliability, mobile-money readiness,
            virtual queue management, staff escalation, and manager visibility in one deployable web app.
          </p>
          <div className="row">
            <Link className="primary" href="/patient">Start patient flow</Link>
            <Link className="secondary" href="/staff">Open staff workbench</Link>
          </div>
        </div>
        <div className="proof">
          {metrics.map(([label, value]) => (
            <div className="metric" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="grid">
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Access channels</p>
            <h2>Web, WhatsApp, and USSD ready</h2>
          </div>
          <div className="content">
            {["Patient web app", "WhatsApp/SMS adapter", "USSD fallback"].map((item) => <div className="card success" key={item}>{item}</div>)}
          </div>
        </article>
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Service directory</p>
            <h2>{services.length} configurable services</h2>
          </div>
          <div className="content">
            {services.map((service) => <div className="card" key={service.id}><strong>{service.name}</strong><p>{service.category}</p></div>)}
          </div>
        </article>
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Clinic network</p>
            <h2>{branches.length} Dar es Salaam branches</h2>
          </div>
          <div className="content">
            {branches.map((branch) => <div className="card" key={branch.id}><strong>{branch.name}</strong><p>{branch.city} - wait {branch.waitTime}</p></div>)}
          </div>
        </article>
      </section>
    </>
  );
}
