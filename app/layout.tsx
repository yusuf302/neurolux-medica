import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroLux Medica | Patient Access OS",
  description: "A Tanzania-first patient-access operating system for clinics.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#062f3a",
  width: "device-width",
  initialScale: 1,
};

const links = [
  ["/patient", "Patient", "Intake, HPI, booking"],
  ["/staff", "Staff", "Cases and escalation"],
  ["/manager", "Manager", "Demand and queue analytics"],
  ["/admin", "Admin", "Clinic configuration"],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <aside className="sidebar">
            <Link className="brand" href="/">
              <strong>NeuroLux Medica</strong>
              <span>Patient Access OS for Tanzanian clinics</span>
            </Link>
            <nav className="nav" aria-label="Main navigation">
              {links.map(([href, label, caption]) => (
                <Link href={href} key={href}>
                  <strong>{label}</strong>
                  <small>{caption}</small>
                </Link>
              ))}
            </nav>
            <p className="muted">Safe intake and booking only. No diagnosis, treatment plan, or medication advice.</p>
          </aside>
          <div className="main">{children}</div>
          <nav className="bottom-nav" aria-label="Mobile navigation">
            {links.map(([href, label]) => (
              <Link href={href} key={href}>{label}</Link>
            ))}
          </nav>
        </div>
      </body>
    </html>
  );
}
