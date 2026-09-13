export type Language = "en" | "sw";
export type Role = "patient" | "staff" | "manager" | "admin";
export type AppointmentStatus = "draft" | "pending_review" | "pending_payment" | "confirmed" | "cancelled" | "completed" | "no_show";

export type HpiField =
  | "duration"
  | "onset"
  | "nature"
  | "periodicity"
  | "associatedFactors"
  | "relievingFactors"
  | "aggravatingFactors";

export type HpiAnswer = {
  field: HpiField;
  label: string;
  question: string;
  answer: string;
};

export type Service = {
  id: string;
  name: string;
  category: string;
  priceTzs: number;
  bookable: boolean;
};

export type Provider = {
  id: string;
  name: string;
  title: string;
  serviceId: string;
  branchId: string;
};

export type Branch = {
  id: string;
  name: string;
  city: string;
  waitTime: string;
};

export type Slot = {
  id: string;
  providerId: string;
  branchId: string;
  label: string;
  status: "available" | "reserved" | "booked";
};

export type PatientCase = {
  id: string;
  patientName: string;
  phone: string;
  language: Language;
  channel: "Web" | "WhatsApp" | "USSD";
  status: AppointmentStatus;
  serviceId: string;
  providerId: string;
  branchId: string;
  slotId: string;
  risk: "routine" | "same_day" | "human_review_required";
  hpi: HpiAnswer[];
  file?: {
    name: string;
    type: string;
    size: string;
    status: "metadata_only" | "stored";
  };
};
