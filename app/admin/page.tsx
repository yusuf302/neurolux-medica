import { branches, providers, services, slots } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <>
      <section className="topline">
        <strong>Admin console</strong>
        <span className="status info">Configuration workspace</span>
      </section>
      <section className="grid">
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Services</p>
            <h2>Clinic service directory</h2>
          </div>
          <div className="content">
            {services.map((service) => (
              <div className="card" key={service.id}>
                <strong>{service.name}</strong>
                <p>{service.category} - TZS {service.priceTzs.toLocaleString()}</p>
                <span className={service.bookable ? "status" : "status warn"}>{service.bookable ? "Bookable" : "Staff triage"}</span>
              </div>
            ))}
            <button className="secondary" type="button">Add service</button>
          </div>
        </article>
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Providers</p>
            <h2>Clinical capacity</h2>
          </div>
          <div className="content">
            {providers.map((provider) => <div className="card" key={provider.id}><strong>{provider.name}</strong><p>{provider.title}</p></div>)}
            <button className="secondary" type="button">Add provider</button>
          </div>
        </article>
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Branches</p>
            <h2>Facility setup</h2>
          </div>
          <div className="content">
            {branches.map((branch) => <div className="card" key={branch.id}><strong>{branch.name}</strong><p>{branch.city} - wait {branch.waitTime}</p></div>)}
            <button className="secondary" type="button">Add branch</button>
          </div>
        </article>
        <article className="panel span-12">
          <div className="panel-head">
            <p className="eyebrow">Availability</p>
            <h2>Slot management and double-booking protection</h2>
          </div>
          <div className="content two-col">
            {slots.map((slot) => <div className="card success" key={slot.id}><strong>{slot.label}</strong><p>{slot.status}</p></div>)}
          </div>
        </article>
      </section>
    </>
  );
}
