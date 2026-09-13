# NeuroLux Medica Production Web App

NeuroLux Medica is a Tanzania-first patient-access operating system for clinics. It is designed to turn patient requests into booked, reviewed, paid, queued, and followed-up clinic visits while keeping clinical decisions with qualified people.

## What is included

- Next.js App Router with TypeScript.
- Mobile-responsive, PWA-ready web experience.
- Patient, staff, manager, and admin routes.
- Safe HPI intake limited to seven fields: duration, onset, nature, periodicity, associated factors, relieving factors, and aggravating factors.
- Appointment, slot, queue, escalation, payment, file metadata, message, and audit data model in Prisma.
- Mock provider interfaces for WhatsApp/SMS, mobile money, and eHIS/GoTHoMIS/FHIR-style export.
- API endpoints for health checks and appointment creation.
- Polished healthcare SaaS UI with mobile-friendly navigation.

## Safety boundary

NeuroLux is an intake, access, booking, and workflow product. It must not provide diagnosis, treatment plans, medication advice, or clinical reassurance. Risky or unclear cases must be routed to human review.

## Local setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment values:

   ```bash
   cp .env.example .env
   ```

3. Add a real PostgreSQL `DATABASE_URL` when you are ready to run migrations.

4. Build and check:

   ```bash
   pnpm typecheck
   pnpm build
   ```

5. Run locally:

   ```bash
   pnpm dev
   ```

## Production direction

The first deployable release is web-first. Real clinic deployment should add production authentication, encrypted file storage, a managed PostgreSQL database, audit-log retention policy, role-based access enforcement, and approved providers for WhatsApp/SMS and mobile money.

The future mobile app should be Flutter after the core web workflow is validated with clinics.
