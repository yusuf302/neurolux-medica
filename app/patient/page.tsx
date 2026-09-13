import { HpiChecklist } from "@/components/hpi-checklist";
import { LanguageToggle } from "@/components/language-toggle";
import { SlotList } from "@/components/slot-list";
import { branches, services } from "@/lib/mock-data";

export default function PatientPage() {
  return (
    <>
      <section className="topline">
        <strong>Patient portal</strong>
        <LanguageToggle />
      </section>
      <section className="grid">
        <article className="panel span-5">
          <div className="panel-head">
            <p className="eyebrow">Safe guided intake</p>
            <h2>Book care without calling reception</h2>
            <span>This flow collects access information and the seven approved HPI fields only.</span>
          </div>
          <div className="content">
            <div className="two-col">
              <label className="field">
                <span>Full name</span>
                <input defaultValue="Amina Juma" />
              </label>
              <label className="field">
                <span>Phone</span>
                <input defaultValue="+255 712 456 900" />
              </label>
            </div>
            <label className="field">
              <span>Service needed</span>
              <select defaultValue="cardiology">
                {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Preferred branch</span>
              <select defaultValue="oysterbay">
                {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Attach medical history</span>
              <input accept="application/pdf,image/png,image/jpeg" type="file" />
              <span>Metadata is captured in v1. Configure encrypted storage before real patient files.</span>
            </label>
            <div className="card warn">
              <strong>Safety boundary</strong>
              <p>This app does not provide diagnosis, treatment plans, medication advice, or clinical reassurance.</p>
            </div>
          </div>
        </article>
        <article className="panel span-7">
          <div className="panel-head">
            <p className="eyebrow">NeuroLux AI receptionist</p>
            <h2>Structured conversation</h2>
          </div>
          <div className="content">
            <div className="chat">
              <div className="bubble patient"><small>Patient</small><span>I want to book a cardiology consultation tomorrow.</span></div>
              <div className="bubble system"><small>NeuroLux</small><span>I can help with access and intake only. I will ask the seven HPI questions, then offer available slots or route to staff.</span></div>
              <div className="bubble patient"><small>Patient</small><span>I have completed the intake and I prefer Oysterbay.</span></div>
              <div className="bubble system"><small>NeuroLux</small><span>Slot reserved for 10 minutes. Mobile-money confirmation is simulated in this version.</span></div>
            </div>
          </div>
        </article>
        <article className="panel span-8">
          <div className="panel-head">
            <p className="eyebrow">History of Presenting Illness</p>
            <h2>Seven-field HPI checklist</h2>
          </div>
          <div className="content">
            <HpiChecklist />
          </div>
        </article>
        <article className="panel span-4">
          <div className="panel-head">
            <p className="eyebrow">Available slots</p>
            <h2>Booking engine</h2>
          </div>
          <div className="content">
            <SlotList />
            <button className="primary" type="button">Reserve slot and simulate payment</button>
          </div>
        </article>
      </section>
    </>
  );
}
