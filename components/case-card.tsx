import { branches, providers, services, slots } from "@/lib/mock-data";
import type { PatientCase } from "@/lib/types";

export function CaseCard({ patientCase }: { patientCase: PatientCase }) {
  const service = services.find((item) => item.id === patientCase.serviceId);
  const provider = providers.find((item) => item.id === patientCase.providerId);
  const branch = branches.find((item) => item.id === patientCase.branchId);
  const slot = slots.find((item) => item.id === patientCase.slotId);

  return (
    <article className={patientCase.risk === "human_review_required" ? "card warn" : "card success"}>
      <span className={patientCase.risk === "human_review_required" ? "status warn" : "status"}>{patientCase.status.replaceAll("_", " ")}</span>
      <h3>{patientCase.patientName}</h3>
      <p>{patientCase.channel} - {patientCase.phone}</p>
      <p>{service?.name} with {provider?.name}</p>
      <p>{branch?.name} - {slot?.label}</p>
    </article>
  );
}
