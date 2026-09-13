import type { Branch, HpiAnswer, PatientCase, Provider, Service, Slot } from "@/lib/types";

export const hpiQuestions: HpiAnswer[] = [
  { field: "duration", label: "Duration", question: "How long has this been happening?", answer: "3 days" },
  { field: "onset", label: "Onset", question: "Did it start suddenly or gradually?", answer: "Started gradually" },
  { field: "nature", label: "Nature", question: "How would you describe what you are feeling?", answer: "Intermittent discomfort" },
  { field: "periodicity", label: "Periodicity", question: "Does it come and go, or is it constant?", answer: "Comes and goes" },
  { field: "associatedFactors", label: "Associated factors", question: "Is there anything else happening with it?", answer: "Mild fatigue" },
  { field: "relievingFactors", label: "Relieving factors", question: "What seems to make it better?", answer: "Rest helps a little" },
  { field: "aggravatingFactors", label: "Aggravating factors", question: "What seems to make it worse?", answer: "Worse after exertion" },
];

export const services: Service[] = [
  { id: "cardiology", name: "Cardiology consultation", category: "Specialist", priceTzs: 85000, bookable: true },
  { id: "ultrasound", name: "Ultrasound scan", category: "Diagnostics", priceTzs: 120000, bookable: true },
  { id: "pediatrics", name: "Pediatric clinic", category: "Family care", priceTzs: 70000, bookable: true },
  { id: "referral", name: "Specialist referral review", category: "Triage", priceTzs: 0, bookable: false },
];

export const branches: Branch[] = [
  { id: "oysterbay", name: "Oysterbay Specialist Centre", city: "Dar es Salaam", waitTime: "18 min" },
  { id: "masaki", name: "Masaki Imaging Wing", city: "Dar es Salaam", waitTime: "24 min" },
  { id: "mikocheni", name: "Mikocheni Family Wing", city: "Dar es Salaam", waitTime: "15 min" },
];

export const providers: Provider[] = [
  { id: "asha", name: "Dr. Asha Mwinyi", title: "Cardiologist", serviceId: "cardiology", branchId: "oysterbay" },
  { id: "neema", name: "Dr. Neema Joseph", title: "Diagnostics Lead", serviceId: "ultrasound", branchId: "masaki" },
  { id: "baraka", name: "Dr. Baraka Mushi", title: "Pediatrician", serviceId: "pediatrics", branchId: "mikocheni" },
];

export const slots: Slot[] = [
  { id: "slot-1030", providerId: "asha", branchId: "oysterbay", label: "Tomorrow, 10:30", status: "available" },
  { id: "slot-1520", providerId: "neema", branchId: "masaki", label: "Today, 15:20", status: "available" },
  { id: "slot-0910", providerId: "baraka", branchId: "mikocheni", label: "Tomorrow, 09:10", status: "reserved" },
];

export const cases: PatientCase[] = [
  {
    id: "case-001",
    patientName: "Amina Juma",
    phone: "+255 712 456 900",
    language: "sw",
    channel: "WhatsApp",
    status: "pending_payment",
    serviceId: "cardiology",
    providerId: "asha",
    branchId: "oysterbay",
    slotId: "slot-1030",
    risk: "routine",
    hpi: hpiQuestions,
    file: { name: "previous-results.pdf", type: "application/pdf", size: "326 KB", status: "metadata_only" },
  },
  {
    id: "case-002",
    patientName: "Rehema Said",
    phone: "+255 754 220 811",
    language: "sw",
    channel: "Web",
    status: "pending_review",
    serviceId: "referral",
    providerId: "asha",
    branchId: "oysterbay",
    slotId: "slot-1030",
    risk: "human_review_required",
    hpi: [],
  },
];

export const auditEvents = [
  "Patient request created",
  "Consent acknowledged",
  "HPI answers captured",
  "Slot reserved for 10 minutes",
  "Mobile-money prompt simulated",
  "Staff packet generated",
];
