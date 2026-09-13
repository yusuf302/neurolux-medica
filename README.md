# NeuroLux Medica Patient Access OS Prototype

This is a no-cost React/Vite prototype for NeuroLux Medica. It presents the product as patient-access and revenue-recovery infrastructure for healthcare organizations, using mock clinic data only.

## What it shows

- A polished buyer-facing healthcare SaaS demo.
- English and Kiswahili language switching for a Tanzania-ready sales conversation.
- Role-based views for patient intake, staff workbench, and manager dashboard.
- Interactive modes for booking, recovered demand, and safe escalation.
- A simulated patient conversation connected to workflow progress.
- A structured HPI intake checklist for duration, onset, nature, periodicity, associated factors, relieving factors, and aggravating factors.
- Browser-only PDF/image attachment preview that shows file metadata without uploading.
- A mock appointment engine using approved-schedule language.
- Web, WhatsApp, and USSD entry points feeding one simulated clinic workflow.
- Slot-lock and mobile-money confirmation states for a Tanzania-ready booking model.
- Virtual queue and arrival board for booked patients, walk-ins, callbacks, and escalations.
- Mock integration readiness for eHIS, GoTHoMIS, clinic calendars, WhatsApp/SMS, and FHIR/HL7-style export.
- A lightweight audit trail showing how trust and accountability would work in production.
- Executive metrics for inquiries, bookings, recovered demand, attendance, and revenue influenced.

## What it does not do

- It does not use real patient data.
- It does not upload, store, or transmit attached files.
- It does not provide medical advice.
- It does not provide diagnosis or treatment plans.
- It does not connect to WhatsApp, clinic systems, AI APIs, payment systems, or databases.
- It is not production software.

## Product direction

NeuroLux is positioned as a Tanzania-first patient-access operating system, not a replacement hospital information system. A production version would sit in front of existing clinic/HIS/EMR systems and handle safe intake, booking, mobile-money confirmation, reminders, missed-demand recovery, virtual queue management, staff review, and manager reporting.

## Running it

Install dependencies with `pnpm install`, run locally with `pnpm dev`, and build with `pnpm build`. The production build is static and can be hosted for free with GitHub Pages.
