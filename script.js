const scenarios = {
  booking: {
    title: "WhatsApp inquiry",
    state: "Booking assisted",
    bookingStatus: "Ready",
    bookingTitle: "Available slot",
    service: "Cardiology consultation",
    doctor: "Dr. Asha Mwinyi",
    slot: "Tomorrow, 10:30",
    location: "Oysterbay branch",
    slots: ["Today 16:00", "Tomorrow 10:30", "Friday 09:00"],
    slotStates: ["Busy", "Open", "Open"],
    impact: "Improving",
    queue: "2 open",
    metrics: ["128", "37", "9", "6"],
    messages: [
      ["patient", "Patient", "Hi, do you have a heart specialist available tomorrow?"],
      ["system", "NeuroLux", "Yes. Cardiology consultation is available tomorrow at 10:30 with Dr. Asha Mwinyi at Oysterbay branch."],
      ["patient", "Patient", "Can you book that for me?"],
      ["system", "NeuroLux", "Booked. I will send the confirmation, location details, and reminder before your appointment."]
    ],
    queueItems: [
      ["Insurance confirmation", "Patient needs staff to confirm coverage before visit.", "MED"],
      ["Lab-result follow-up", "Returning patient asked for next step after tests.", "MED"]
    ]
  },
  recovery: {
    title: "Recovery workflow",
    state: "Patient recovered",
    bookingStatus: "Recovered",
    bookingTitle: "Recovered booking",
    service: "Ultrasound scan",
    doctor: "Diagnostics team",
    slot: "Today, 15:20",
    location: "Masaki diagnostics",
    slots: ["Today 15:20", "Today 17:10", "Tomorrow 08:40"],
    slotStates: ["Reserved", "Open", "Open"],
    impact: "Recovered",
    queue: "1 open",
    metrics: ["142", "41", "14", "5"],
    messages: [
      ["patient", "Patient", "I started booking an ultrasound but did not finish."],
      ["system", "NeuroLux", "I found the unfinished booking. There is still a diagnostics slot today at 15:20. Would you like me to reserve it?"],
      ["patient", "Patient", "Yes, reserve it."],
      ["system", "NeuroLux", "Reserved. A reminder will be sent before the appointment, and staff can see this as recovered demand."]
    ],
    queueItems: [
      ["Payment question", "Patient requested manual confirmation for payment options.", "LOW"]
    ]
  },
  escalation: {
    title: "Clinical-risk routing",
    state: "Escalated safely",
    bookingStatus: "Paused",
    bookingTitle: "Booking paused",
    service: "Urgent nurse review",
    doctor: "Clinical desk",
    slot: "Immediate staff callback",
    location: "Escalation queue",
    slots: ["Immediate callback", "Nurse review", "Emergency guidance"],
    slotStates: ["Queued", "Assigned", "Staff only"],
    impact: "Protected",
    queue: "3 open",
    metrics: ["119", "31", "8", "9"],
    messages: [
      ["patient", "Patient", "I have chest pain and trouble breathing. Should I wait until tomorrow?"],
      ["system", "NeuroLux", "I cannot safely assess that by chat. I am escalating this now and advising urgent medical attention according to clinic policy."],
      ["staff", "Clinical desk", "High-priority case created for immediate staff callback."],
      ["system", "NeuroLux", "A staff member has been alerted. If symptoms are severe or worsening, seek emergency care now."]
    ],
    queueItems: [
      ["Chest pain triage", "Patient reports chest pain and breathing difficulty. Immediate staff review required.", "HIGH"],
      ["Medication safety", "Patient asks whether to stop prescribed medication.", "HIGH"],
      ["Post-procedure concern", "Patient reports unexpected symptoms after a procedure.", "MED"]
    ]
  }
};

const conversation = document.querySelector("#conversation");
const buttons = document.querySelectorAll(".scenario-button");

function setText(id, value) {
  document.querySelector(id).textContent = value;
}

function renderScenario(key) {
  const scenario = scenarios[key];

  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === key);
  });

  setText("#conversation-title", scenario.title);
  setText("#conversation-state", scenario.state);
  setText("#booking-status", scenario.bookingStatus);
  setText("#booking-title", scenario.bookingTitle);
  setText("#service-name", scenario.service);
  setText("#doctor-name", scenario.doctor);
  setText("#slot-time", scenario.slot);
  setText("#clinic-location", scenario.location);
  setText("#slot-one", scenario.slots[0]);
  setText("#slot-two", scenario.slots[1]);
  setText("#slot-three", scenario.slots[2]);
  setText("#slot-one-status", scenario.slotStates[0]);
  setText("#slot-two-status", scenario.slotStates[1]);
  setText("#slot-three-status", scenario.slotStates[2]);
  setText("#impact-label", scenario.impact);
  setText("#queue-count", scenario.queue);
  setText("#metric-inquiries", scenario.metrics[0]);
  setText("#metric-bookings", scenario.metrics[1]);
  setText("#metric-recovered", scenario.metrics[2]);
  setText("#metric-escalations", scenario.metrics[3]);

  conversation.innerHTML = scenario.messages
    .map(([type, speaker, text]) => `<div class="message ${type}"><small>${speaker}</small>${text}</div>`)
    .join("");

  document.querySelector("#queue-list").innerHTML = scenario.queueItems
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
}

buttons.forEach((button) => {
  button.addEventListener("click", () => renderScenario(button.dataset.scenario));
});

document.querySelector("#next-step-button").addEventListener("click", () => {
  const active = document.querySelector(".scenario-button.active");
  const order = Object.keys(scenarios);
  const next = order[(order.indexOf(active.dataset.scenario) + 1) % order.length];
  renderScenario(next);
});

renderScenario("booking");
