const metrics = [
  ["Inquiries handled", "328"],
  ["Bookings confirmed", "119"],
  ["Recovered demand", "34"],
  ["Escalations reviewed", "18"],
  ["Attendance", "82%"],
  ["Revenue influenced", "TZS 42.8M"],
];

export default function ManagerPage() {
  return (
    <>
      <section className="topline">
        <strong>Manager dashboard</strong>
        <span className="status info">Mock analytics from operational records</span>
      </section>
      <section className="grid">
        <article className="panel span-8">
          <div className="panel-head">
            <p className="eyebrow">Executive summary</p>
            <h2>Demand, recovery, attendance, and staff workload</h2>
          </div>
          <div className="content">
            <div className="proof">
              {metrics.map(([label, value]) => <div className="metric" key={label}><span>{label}</span><strong>{value}</strong></div>)}
            </div>
          </div>
        </article>
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Revenue leakage</p>
            <h2>Patient access funnel</h2>
          </div>
          <div className="content">
            {["Inquiry 328", "HPI completed 244", "Slot selected 151", "Confirmed 119", "Attended 98"].map((item) => (
              <div className="card success" key={item}>{item}</div>
            ))}
          </div>
        </article>
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Branch pressure</p>
            <h2>Live queue view</h2>
          </div>
          <div className="content">
            {["Oysterbay: 18 min", "Masaki: 24 min", "Mikocheni: 15 min"].map((item) => <div className="card" key={item}>{item}</div>)}
          </div>
        </article>
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Recovery</p>
            <h2>Missed demand automation</h2>
          </div>
          <div className="content">
            {["Reminder accepted: 21", "Rescheduled: 9", "Cancelled: 4"].map((item) => <div className="card" key={item}>{item}</div>)}
          </div>
        </article>
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Safety</p>
            <h2>Escalation reasons</h2>
          </div>
          <div className="content">
            {["Risk wording: 8", "Unclear request: 6", "Service mismatch: 4"].map((item) => <div className="card warn" key={item}>{item}</div>)}
          </div>
        </article>
      </section>
    </>
  );
}
