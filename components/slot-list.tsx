import { branches, providers, slots } from "@/lib/mock-data";

export function SlotList() {
  return (
    <div className="slot-list">
      {slots.map((slot) => {
        const provider = providers.find((item) => item.id === slot.providerId);
        const branch = branches.find((item) => item.id === slot.branchId);
        return (
          <div className="card" key={slot.id}>
            <span className={slot.status === "available" ? "status" : "status info"}>{slot.status}</span>
            <strong>{slot.label}</strong>
            <p>{provider?.name} - {branch?.name}</p>
          </div>
        );
      })}
    </div>
  );
}
