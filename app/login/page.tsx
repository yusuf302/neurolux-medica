import Link from "next/link";

const roles = [
  {
    href: "/patient",
    role: "Patient",
    title: "Create a personal patient dashboard",
    body: "Enter name, email, and phone, then complete service choice, History of Presenting Illness intake, file metadata, and booking.",
  },
  {
    href: "/staff",
    role: "Medical staff",
    title: "Review live patient cases",
    body: "Open intake packets, see AI safety routing, confirm bookings, request callbacks, or escalate to a clinician.",
  },
  {
    href: "/manager",
    role: "Manager",
    title: "Track clinic performance",
    body: "Watch demand, completed History of Presenting Illness intake, booking status, human review, and revenue-influenced metrics update from cases.",
  },
];

export default function LoginPage() {
  return (
    <>
      <section className="topline">
        <strong>Choose demo role</strong>
        <span className="status info">No password required for prototype preview</span>
      </section>
      <section className="hero">
        <div>
          <p className="eyebrow">Role-based access</p>
          <h1>Enter NeuroLux as the patient, staff member, or clinic manager.</h1>
          <p>
            This preview keeps login lightweight so buyers can experience the full workflow quickly. Real authentication
            can be connected when clinic deployment details are confirmed.
          </p>
        </div>
        <div className="content">
          {roles.map((item) => (
            <Link className="card success" href={item.href} key={item.role}>
              <span className="status">{item.role}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
