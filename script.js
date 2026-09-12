const services = {
  cardiology: {
    name: "Cardiology consultation",
    doctor: "Dr. Asha Mwinyi",
    branch: "Oysterbay branch",
    price: "TZS 85,000",
    slots: { morning: "Tomorrow, 10:30", afternoon: "Today, 15:40", evening: "Friday, 18:00" }
  },
  diagnostics: {
    name: "Ultrasound scan",
    doctor: "Diagnostics team",
    branch: "Masaki diagnostics",
    price: "TZS 120,000",
    slots: { morning: "Tomorrow, 08:40", afternoon: "Today, 15:20", evening: "Thursday, 17:30" }
  },
  dental: {
    name: "Dental treatment",
    doctor: "Dr. Neema Joseph",
    branch: "City clinic",
    price: "From TZS 60,000",
    slots: { morning: "Today, 11:15", afternoon: "Tomorrow, 14:00", evening: "Thursday, 18:20" }
  },
  pediatrics: {
    name: "Pediatric clinic",
    doctor: "Dr. Baraka Mushi",
    branch: "Mikocheni family wing",
    price: "TZS 70,000",
    slots: { morning: "Tomorrow, 09:10", afternoon: "Today, 16:10", evening: "Friday, 17:45" }
  }
};

const stages = ["Inquiry", "Qualify", "Book", "Remind", "Recover", "Report"];
const baseMetrics = { inquiries: 128, bookings: 37, recovered: 9, escalations: 6 };
const state = { step: 0, metrics: { ...baseMetrics } };

const els = {
  service: document.querySelector("#service-select"),
  intent: document.querySelector("#intent-select"),
  urgency: document.querySelector("#urgency-select"),
  time: document.querySelector("#time-select"),
  conversation: document.querySelector("#conversation"),
  timeline: document.querySelector("#timeline"),
  queue: document.querySelector("#queue-list")
};

function setText(id, value) {
  document.querySelector(id).textContent = value;
}

function getCase() {
  const service = services[els.service.value];
  const intent = els.intent.value;
  const urgency = els.urgency.value;
  return {
    service,
    intent,
    urgency,
    time: els.time.value,
    risk: urgency === "risk" || urgency === "uncertain",
    recovery: intent === "abandoned",
    slot: service.slots[els.time.value]
  };
}

function patientOpening(demoCase) {
  if (demoCase.urgency === "risk") {
    return `I need ${demoCase.service.name.toLowerCase()}, but I also have chest pain and trouble breathing. Should I wait?`;
  }
  if (demoCase.urgency === "uncertain") {
    return `I am not sure what service I need. Can someone check my symptoms before I book?`;
  }
  if (demoCase.intent === "price") {
    return `How much is ${demoCase.service.name.toLowerCase()} and do you have a ${demoCase.time} slot?`;
  }
  if (demoCase.intent === "abandoned") {
    return `I started booking ${demoCase.service.name.toLowerCase()} but left before confirming. Is the slot still available?`;
  }
  if (demoCase.intent === "followup") {
    return `I visited before and need a follow-up for ${demoCase.service.name.toLowerCase()}.`;
  }
  return `Hi, I want to book ${demoCase.service.name.toLowerCase()} in the ${demoCase.time}.`;
}

function messagesForStep(demoCase) {
  const escalationFlow = [
    ["patient", "Patient", patientOpening(demoCase)],
    ["system", "NeuroLux", "I cannot safely assess this by chat. I am routing this to clinic staff now and advising urgent medical attention according to clinic policy."],
    ["staff", "Clinical desk", `${demoCase.service.name} case created for immediate staff review.`],
    ["system", "NeuroLux", "A staff member has been alerted. The conversation is paused for human review."],
    ["staff", "Clinical desk", "Case tagged high priority with patient context and requested service."],
    ["system", "NeuroLux", "Management can see that the risky conversation was contained and escalated."]
  ];

  const bookingFlow = [
    ["patient", "Patient", patientOpening(demoCase)],
    ["system", "NeuroLux", `I found ${demoCase.service.name.toLowerCase()} at ${demoCase.service.branch}. The ${demoCase.time} option is ${demoCase.slot}.`],
    ["system", "NeuroLux", `The approved price shown for this service is ${demoCase.service.price}. The schedule source is the clinic availability table.`],
    ["patient", "Patient", "Please reserve that for me."],
    ["system", "NeuroLux", `Confirmed with ${demoCase.service.doctor}. A reminder will be sent before ${demoCase.slot}.`],
    ["system", "NeuroLux", demoCase.recovery ? "This was marked as recovered demand because the patient returned after abandoning the booking." : "The booking is now counted in the weekly patient-access report."]
  ];

  return (demoCase.risk ? escalationFlow : bookingFlow).slice(0, state.step + 1);
}

function renderMessages(demoCase) {
  els.conversation.innerHTML = messagesForStep(demoCase)
    .map(([type, speaker, text]) => `<div class="message ${type}"><small>${speaker}</small>${text}</div>`)
    .join("");
}

function renderTimeline() {
  els.timeline.innerHTML = stages
    .map((stage, index) => `
      <div class="timeline-step ${index <= state.step ? "done" : ""}">
        <span>${index + 1}</span>
        ${stage}
      </div>
    `)
    .join("");
  setText("#stage-label", stages[Math.min(state.step, stages.length - 1)]);
}

function renderDecision(demoCase) {
  setText("#service-name", demoCase.service.name);
  setText("#doctor-name", demoCase.risk ? "Clinical desk" : demoCase.service.doctor);
  setText("#slot-time", demoCase.risk ? "Immediate staff callback" : demoCase.slot);
  setText("#clinic-location", demoCase.risk ? "Escalation queue" : demoCase.service.branch);

  if (demoCase.risk) {
    setText("#conversation-state", "Escalated safely");
    setText("#decision-title", "Route to human care team");
    setText("#decision-status", "Staff required");
    setText("#confirmation-title", "Booking paused for safety");
    setText("#confirmation-copy", "The prototype avoids medical advice and creates a staff handoff when risk or uncertainty is detected.");
    setText("#reminder-chip", "No automated advice");
    setText("#recovery-chip", "Staff callback created");
    setText("#escalation-reason", demoCase.urgency === "risk"
      ? "Clinical-risk language detected: symptoms require staff review instead of automated guidance."
      : "Low confidence detected: the system asks for staff support instead of guessing.");
    return;
  }

  setText("#conversation-state", state.step >= 4 ? "Booked and reminded" : "Working");
  setText("#decision-title", demoCase.recovery ? "Recover abandoned booking" : "Create appointment");
  setText("#decision-status", state.step >= 4 ? "Confirmed" : "Ready");
  setText("#confirmation-title", state.step >= 4 ? "Confirmation sent" : "Ready to confirm");
  setText("#confirmation-copy", state.step >= 4
    ? `${demoCase.service.name} is confirmed for ${demoCase.slot}. The patient receives branch details and a reminder.`
    : "The system is checking verified service, price, branch, and availability before confirming.");
  setText("#reminder-chip", state.step >= 4 ? "Reminder scheduled" : "Reminder pending");
  setText("#recovery-chip", demoCase.recovery && state.step >= 5 ? "Recovered opportunity" : "Recovery idle");
  setText("#escalation-reason", "No clinical-risk signal detected. Routine scheduling can continue while staff focus on exceptions.");
}

function calculateMetrics(demoCase) {
  const progress = Math.min(state.step, 5);
  const metrics = { ...baseMetrics };
  metrics.inquiries += progress * 3;

  if (demoCase.risk) {
    metrics.escalations += Math.max(1, progress);
  } else {
    metrics.bookings += Math.max(0, progress - 1) * 2;
    if (demoCase.recovery) metrics.recovered += Math.max(0, progress - 2) * 2;
  }
  return metrics;
}

function renderMetrics(demoCase) {
  const nextMetrics = calculateMetrics(demoCase);
  [
    ["#metric-inquiries", "inquiries"],
    ["#metric-bookings", "bookings"],
    ["#metric-recovered", "recovered"],
    ["#metric-escalations", "escalations"]
  ].forEach(([selector, key]) => {
    const element = document.querySelector(selector);
    if (String(nextMetrics[key]) !== element.textContent) {
      element.classList.remove("bump");
      element.textContent = nextMetrics[key];
      requestAnimationFrame(() => element.classList.add("bump"));
    }
  });

  setText("#impact-label", demoCase.risk ? "Trust protected" : demoCase.recovery ? "Demand recovered" : "Conversion lift");
  setText("#impact-note", demoCase.risk
    ? "Buyer takeaway: NeuroLux protects patient trust by escalating risky or uncertain conversations."
    : demoCase.recovery
      ? "Buyer takeaway: abandoned demand is not lost quietly; the system follows up and reports recovered value."
      : "Buyer takeaway: verified answers, booking, and reminders move more inquiries toward completed visits.");
}

function renderQueue(demoCase) {
  const items = demoCase.risk
    ? [
        [`Urgent ${demoCase.service.name.toLowerCase()}`, "Patient language requires immediate staff review.", "HIGH"],
        ["Medication or symptom question", "Automation blocked advice and requested human review.", "HIGH"],
        ["Post-visit concern", "Staff should review before any follow-up message is sent.", "MED"]
      ]
    : demoCase.recovery
      ? [
          ["Recovered booking", `${demoCase.service.name} patient returned and confirmed ${demoCase.slot}.`, "LOW"],
          ["Payment question", "Patient asked for manual confirmation of accepted payment options.", "LOW"]
        ]
      : [
          ["Insurance confirmation", "Patient needs staff to confirm coverage before visit.", "MED"],
          ["Follow-up request", "Returning patient asked for next step after completed care.", "MED"]
        ];

  els.queue.innerHTML = items
    .map(([title, body, priority]) => `
      <div class="queue-item">
        <div>
          <strong>${title}</strong>
          <p>${body}</p>
        </div>
        <span class="priority">${priority}</span>
      </div>
    `)
    .join("");
  setText("#queue-count", `${items.length} open`);
}

function render() {
  const demoCase = getCase();
  renderTimeline();
  renderMessages(demoCase);
  renderDecision(demoCase);
  renderMetrics(demoCase);
  renderQueue(demoCase);
}

function resetFlow() {
  state.step = 0;
  state.metrics = { ...baseMetrics };
  render();
}

document.querySelector("#next-step-button").addEventListener("click", () => {
  state.step = (state.step + 1) % stages.length;
  render();
});

document.querySelector("#reset-button").addEventListener("click", resetFlow);
document.querySelectorAll("select").forEach((select) => select.addEventListener("change", resetFlow));

render();
