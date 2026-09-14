import { branches, cases, hpiQuestions, providers, services, slots } from "@/lib/mock-data";
import type { AppointmentStatus, HpiAnswer, Language, PatientCase } from "@/lib/types";

export type DemoUser = {
  name: string;
  email: string;
  phone: string;
  role: "patient" | "staff" | "manager";
};

export type DemoCase = PatientCase & {
  email: string;
  urgency: "routine" | "same_day" | "urgent";
  createdAt: string;
  updatedAt: string;
  notes: string;
  messages: { speaker: "patient" | "neurolux" | "staff"; text: string }[];
};

export type IntakeDraft = {
  serviceId: string;
  branchId: string;
  urgency: "routine" | "same_day" | "urgent";
  hpi: Record<string, string>;
  notes: string;
  file?: DemoCase["file"];
};

const userKey = "neurolux.demo.user";
const casesKey = "neurolux.demo.cases";

export function defaultCases(): DemoCase[] {
  return cases.map((item, index) => ({
    ...item,
    email: index === 0 ? "amina@example.com" : "rehema@example.com",
    urgency: item.risk === "human_review_required" ? "urgent" : "routine",
    createdAt: new Date(Date.now() - (index + 1) * 36 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - index * 18 * 60 * 1000).toISOString(),
    notes: index === 0 ? "Patient prefers morning appointment." : "Patient wording needs human review before booking.",
    messages: [
      { speaker: "patient", text: index === 0 ? "I need to book a clinic visit." : "I am not sure if this is urgent." },
      {
        speaker: "neurolux",
        text:
          item.risk === "human_review_required"
            ? "I will pause automation and send this to clinic staff for review. I cannot give diagnosis or treatment advice."
            : "I can help collect access details and History of Presenting Illness information, then reserve an appointment slot.",
      },
    ],
  }));
}

export function getStoredUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(userKey);
  return raw ? (JSON.parse(raw) as DemoUser) : null;
}

export function saveStoredUser(user: DemoUser) {
  window.localStorage.setItem(userKey, JSON.stringify(user));
}

export function getStoredCases(): DemoCase[] {
  if (typeof window === "undefined") return defaultCases();
  const raw = window.localStorage.getItem(casesKey);
  if (!raw) {
    const seed = defaultCases();
    window.localStorage.setItem(casesKey, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw) as DemoCase[];
}

export function saveStoredCases(items: DemoCase[]) {
  window.localStorage.setItem(casesKey, JSON.stringify(items));
  window.dispatchEvent(new Event("neurolux-cases-updated"));
}

export function resetDemoCases() {
  saveStoredCases(defaultCases());
}

export function buildHpiAnswers(hpi: Record<string, string>): HpiAnswer[] {
  return hpiQuestions
    .filter((item) => hpi[item.field]?.trim())
    .map((item) => ({ ...item, answer: hpi[item.field].trim() }));
}

export function detectRisk(draft: IntakeDraft) {
  const text = `${draft.urgency} ${draft.notes} ${Object.values(draft.hpi).join(" ")}`.toLowerCase();
  const risky = ["chest pain", "difficulty breathing", "faint", "bleeding", "severe", "unconscious", "can't breathe", "cannot breathe"];
  if (draft.urgency === "urgent" || risky.some((word) => text.includes(word))) return "human_review_required";
  if (draft.urgency === "same_day") return "same_day";
  return "routine";
}

export function createCase(user: DemoUser, draft: IntakeDraft, language: Language): DemoCase {
  const service = services.find((item) => item.id === draft.serviceId) ?? services[0];
  const branch = branches.find((item) => item.id === draft.branchId) ?? branches[0];
  const provider = providers.find((item) => item.serviceId === service.id && item.branchId === branch.id) ?? providers[0];
  const slot = slots.find((item) => item.branchId === branch.id && item.status === "available") ?? slots[0];
  const risk = detectRisk(draft);
  const status: AppointmentStatus = risk === "human_review_required" ? "pending_review" : "pending_payment";
  const hpi = buildHpiAnswers(draft.hpi);
  const now = new Date().toISOString();

  return {
    id: `case-${Date.now()}`,
    patientName: user.name,
    email: user.email,
    phone: user.phone,
    language,
    channel: "Web",
    status,
    serviceId: service.id,
    providerId: provider.id,
    branchId: branch.id,
    slotId: slot.id,
    risk,
    urgency: draft.urgency,
    hpi,
    file: draft.file,
    createdAt: now,
    updatedAt: now,
    notes: draft.notes,
    messages: buildMessages(user.name, service.name, branch.name, risk, hpi.length),
  };
}

function buildMessages(patientName: string, serviceName: string, branchName: string, risk: DemoCase["risk"], hpiCount: number) {
  const base = [
    { speaker: "patient" as const, text: `My name is ${patientName}. I want help with ${serviceName}.` },
    {
      speaker: "neurolux" as const,
      text: `I will collect access details and History of Presenting Illness information only. ${hpiCount} of 7 fields are captured.`,
    },
  ];

  if (risk === "human_review_required") {
    return [
      ...base,
      {
        speaker: "neurolux" as const,
        text: "This needs human review. I will not provide diagnosis or treatment advice, and clinic staff can follow up safely.",
      },
    ];
  }

  return [
    ...base,
    {
      speaker: "neurolux" as const,
      text: `A matching appointment can be reserved at ${branchName}. Payment and confirmation are simulated in this version.`,
    },
  ];
}
