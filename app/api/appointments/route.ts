import { z } from "zod";
import { mockHospitalSystemProvider, mockPaymentProvider } from "@/lib/providers";

const bookingSchema = z.object({
  patientId: z.string().min(1),
  serviceId: z.string().min(1),
  slotId: z.string().min(1),
  phone: z.string().min(10),
  amountTzs: z.number().int().nonnegative(),
  hpi: z.array(z.object({ field: z.string(), answer: z.string() })).max(7),
});

export async function POST(request: Request) {
  const parsed = bookingSchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json({ error: "Invalid booking request", details: parsed.error.flatten() }, { status: 400 });
  }

  const appointmentId = `appt-${Date.now()}`;
  const payment = await mockPaymentProvider.requestPayment({
    appointmentId,
    amountTzs: parsed.data.amountTzs,
    phone: parsed.data.phone,
  });
  const exportResult = await mockHospitalSystemProvider.exportAppointment({ appointmentId, destination: "FHIR" });

  return Response.json({
    appointmentId,
    status: parsed.data.amountTzs > 0 ? "pending_payment" : "pending_review",
    slotLockSeconds: 600,
    payment,
    hospitalExport: exportResult,
    safety: "No diagnosis or treatment advice generated. HPI capped at seven approved fields.",
  }, { status: 201 });
}
