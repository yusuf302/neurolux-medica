export type ProviderResult = {
  ok: true;
  reference: string;
  message: string;
};

export interface MessagingProvider {
  sendReminder(to: string, body: string): Promise<ProviderResult>;
}

export interface PaymentProvider {
  requestPayment(input: { phone: string; amountTzs: number; appointmentId: string }): Promise<ProviderResult>;
}

export interface HospitalSystemProvider {
  exportAppointment(input: { appointmentId: string; destination: "eHIS" | "GoTHoMIS" | "FHIR" }): Promise<ProviderResult>;
}

export const mockMessagingProvider: MessagingProvider = {
  async sendReminder() {
    return { ok: true, reference: "MSG-MOCK-2401", message: "Reminder queued in simulated WhatsApp/SMS adapter." };
  },
};

export const mockPaymentProvider: PaymentProvider = {
  async requestPayment(input) {
    return {
      ok: true,
      reference: `PAY-MOCK-${input.appointmentId.toUpperCase()}`,
      message: "Mobile-money prompt simulated. Replace adapter after provider approval.",
    };
  },
};

export const mockHospitalSystemProvider: HospitalSystemProvider = {
  async exportAppointment(input) {
    return {
      ok: true,
      reference: `${input.destination}-MOCK-${input.appointmentId.toUpperCase()}`,
      message: "Hospital-system export simulated behind integration-ready interface.",
    };
  },
};
