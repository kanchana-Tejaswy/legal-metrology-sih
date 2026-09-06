# Government of India • Department of Legal Metrology
## Online Verification System for Weighing and Measuring Instruments
### Smart India Hackathon (SIH 26036) — Production-Grade Working Prototype

---

## 1. Executive Summary & Statutory Purpose

This platform digitizes the statutory lifecycle of commercial weighing and measuring instruments in conformity with the **Legal Metrology Act, 2009** and the **Legal Metrology (General) Rules, 2011**.

> **Crucial Statutory Principle:**
> The software does NOT claim to physically measure or automatically determine whether a physical weighing machine is accurate.
> **The actual physical inspection, standard weight calibration, and tolerance testing are executed on-site or in an accredited laboratory by an authorized Legal Metrology Officer (LMO) or Government Approved Test Centre (GATC)**.
> This software records field observations, verifies tolerance compliance, issues tamper-evident digital certificates, tracks validity dates, generates dynamic QR codes, and provides public consumer authentication.

---

## 2. Technology Stack

* **Frontend:**
  * React.js 18 + Vite
  * React Router DOM v6
  * Tailwind CSS (Custom Indian Government Department Design Tokens)
  * Lucide React Icons
  * High-accessibility typography (Inter & Merriweather)
* **Backend:**
  * Node.js & Express.js REST API
  * JWT Authentication & Role-Based Access Control (RBAC)
  * `bcryptjs` password encryption
  * `qrcode` dynamic live verification QR generation
  * Cryptographic SHA-256 digital signature digests
  * Centralized audit logging & automated expiry notification engine
* **Database & Storage:**
  * **Supabase PostgreSQL** Database
  * Full schema DDL with foreign keys, checks, and Row Level Security (RLS) policies
  * Supabase Storage buckets for documents, photographs, evidence, and certificates
  * **Dual-Mode Engine:** Runs seamlessly against cloud Supabase PostgreSQL or with the built-in resilient in-memory data adapter preloaded with seed records.

---

## 3. Directory Layout

```
sih/
├── database/
│   ├── schema.sql           # PostgreSQL / Supabase table definitions (12 tables + RLS)
│   ├── seed.sql             # Demo accounts, instruments, categories, certificates
│   └── storage_setup.sql    # Supabase storage buckets and access policies
├── backend/
│   ├── src/
│   │   ├── config/          # Supabase client & environment configuration
│   │   ├── controllers/     # Auth, Instruments, Applications, Allocation, Verification, Certificates
│   │   ├── middleware/      # JWT auth, RBAC guards, stakeholder approval enforcement
│   │   ├── models/          # Resilient dual-mode database adapter & seed state
│   │   ├── routes/          # REST endpoints
│   │   ├── services/        # QR generation, digital certificates, audit logs, notifications
│   │   └── server.js        # Express application entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/              # Official SVG emblem seal & static assets
│   ├── src/
│   │   ├── components/      # Government TopBar, Header, Navbar, Footer, Modal, DataTable, StatusBadge
│   │   ├── context/         # AuthContext (JWT & approval states), NotificationContext
│   │   ├── pages/           # Public, Auth, Owner, LMO, GATC, and Admin interfaces
│   │   ├── services/        # API client
│   │   ├── App.jsx          # React Router v6 tree with role-protected routes
│   │   ├── main.jsx
│   │   └── index.css        # Indian Government visual design system & print styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── run_all.bat              # One-click Windows launch script (starts backend & frontend)
├── run_backend.bat          # Starts backend on http://localhost:5000
├── run_frontend.bat         # Starts frontend on http://localhost:5173
└── README.md
```

---

## 4. Pre-Configured Demo Accounts

All demo accounts share the password:
```text
DemoPassword@2026
```

| Role | Email ID | Description |
| :--- | :--- | :--- |
| **Department Administrator** | `admin@legalmetrology.demo` | Full administrative oversight, stakeholder approvals, allocation, scheduling & certificate revocation |
| **Approved Business Owner** | `owner@business.demo` | ABC Supermarket Ltd. (Can register instruments, submit applications, view certificates) |
| **Pending Business Owner** | `newapplicant@traders.demo` | Sri Lakshmi Traders (Demonstrates PENDING approval state; restricted until approved) |
| **Legal Metrology Officer (LMO)** | `lmo@legalmetrology.demo` | Inspector R. Sharma (Mumbai Division - Zone 3 Field Workspace) |
| **GATC Test Centre** | `gatc@testcentre.demo` | Metro Metrology & Testing Services (Accredited scope: EWS, PWS, PCS) |

---

## 5. Quick Start Instructions (Windows)

### Option A: One-Click Execution
Double-click `run_all.bat`.
This will:
1. Automatically install Node dependencies if missing.
2. Launch the Express REST API server on `http://localhost:5000`.
3. Launch the Vite React frontend portal on `http://localhost:5173`.

### Option B: Manual Terminal Execution
**Step 1: Start Backend**
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

**Step 2: Start Frontend**
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 6. Supabase Cloud Configuration (Optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Execute the contents of `database/schema.sql`.
4. Execute `database/storage_setup.sql` to configure the `documents`, `photos`, `evidence`, and `certificates` buckets.
5. (Optional) Run `database/seed.sql` to insert sample baseline data.
6. Copy your **Project URL** and **Service Role API Key** from **Project Settings → API**.
7. In `backend/.env`, set:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
*(Note: If Supabase keys are not set, the system automatically uses its high-fidelity in-memory engine pre-seeded with all records, so all 28 evaluation steps work out of the box!)*

---

## 7. The Complete 28-Step End-to-End Acceptance Test Walkthrough

Follow this scenario to demonstrate 100% compliance with SIH 26036 requirements:

1. **Stakeholder Registration:**
   * Go to `http://localhost:5173/register`.
   * Fill out the form as a new business owner (e.g. *Kavadi Weighing Enterprises*).
   * Submit registration. The portal displays: *"Registration submitted successfully. Your account is pending verification/approval by Department Administrator."*
2. **Pending Enforcement:**
   * Attempt to login with the new account or click the One-Click Demo button for *Pending Owner* (`newapplicant@traders.demo`).
   * The portal routes you to `/pending-approval` — you cannot access instrument registration or verification applications.
3. **Admin Stakeholder Approval:**
   * Sign out and log in as **Admin** (`admin@legalmetrology.demo`).
   * Navigate to **Stakeholder Approvals** (`/admin/stakeholders`).
   * Locate the pending applicant. Click **[ Approve ]**, enter review notes, and confirm. The account state transitions from `PENDING` to `APPROVED`.
4. **Instrument Registration:**
   * Log in as the approved **Owner** (`owner@business.demo`).
   * Navigate to **My Instruments** → Click **[ Register New Instrument ]**.
   * Enter details (e.g. Model: `MT-500`, Serial Number: `SN-2026-TEST-99`, Capacity: `50 kg`, Location: `Warehouse Dock 4`).
   * Notice that registering a duplicate serial number under the same category is automatically blocked with an error!
5. **Submit Verification Application:**
   * Navigate to **Apply for Verification** (`/owner/apply`).
   * Select the registered instrument, choose **Initial Verification**, select preferred inspection date and time slot, and submit.
   * A unique statutory Application ID is generated (e.g. `LM-APP-2026-000104`).
6. **Admin Allocation & Scheduling:**
   * Log in as **Admin** (`admin@legalmetrology.demo`) → Go to **Applications & Workload** (`/admin/applications`).
   * Click **[ Allocate ]** on the new application.
   * Choose either **LMO** (Inspector R. Sharma) or **GATC** (Metro Metrology Lab). *(Notice: If assigning to GATC, the system verifies that the instrument category is within the GATC's accredited scope!)*
   * Click **[ Schedule ]** to fix the official date, time, and inspection venue.
7. **Owner Schedule Visibility:**
   * Log in as **Owner** (`owner@business.demo`) → Go to **Applications Tracker**.
   * Notice the application now reflects status `SCHEDULED` with the assigned officer and confirmed inspection date.
8. **Field Inspection & Verification Workspace:**
   * Log in as **LMO** (`lmo@legalmetrology.demo`) or **GATC** (`gatc@testcentre.demo`).
   * Open the assigned application by clicking **[ Open Workspace ]** (`/lmo/workspace/LM-APP-2026-000104`).
   * In the field-friendly mobile workspace, check off the visual checklist (stamping port, spirit level, zero tracking).
   * Enter metrological test results (repeatability error, eccentricity error, maximum permissible error comparison).
   * Enter field observations and upload evidence photograph.
   * Click **[ PASS — Issue Digital Certificate ]**.
9. **Certificate Generation & Live QR Verification:**
   * The system saves the verification record, updates the instrument to `VALID`, generates digital certificate `CERT-2026-XXXXXX`, and generates a live QR code.
   * Log in as **Owner** → Go to **Certificates** (`/owner/certificates`).
   * Open the official certificate with the Government emblem, security border, digital signature digest, and click **[ Print / Save as PDF ]**.
10. **Public Real-Time QR Verification (No Login Required):**
    * Open an Incognito window and visit `http://localhost:5173/verify/CERT-2026-000101` (or scan the certificate QR).
    * Notice the public verification page queries the live database and displays a vibrant green **✓ VALID & VERIFIED CERTIFICATE** banner with full instrument specifications and verifying authority details.
11. **Administrative Revocation & Live QR Update:**
    * Log in as **Admin** → Go to **Certificates Registry** (`/admin/certificates`).
    * Click **[ Revoke ]** on `CERT-2026-000101`, enter administrative justification (e.g. *"Lead seal tampered during market surveillance inspection"*), and confirm.
    * Now refresh the public verification page in the incognito window (`/verify/CERT-2026-000101`).
    * **The EXACT SAME QR URL now displays a red ✕ CERTIFICATE REVOKED banner with the revocation reason and timestamp!**
12. **Automatic Date-Based Expiry:**
    * Visit `/verify/CERT-2025-000088` (a certificate whose valid_until date has elapsed).
    * Notice the system dynamically calculates current date vs validity date and immediately displays **⚠ CERTIFICATE EXPIRED**.
13. **Audit Trail:**
    * Log in as **Admin** → Go to **Audit Logs** (`/admin/audit-logs`).
    * Notice every single action (registration, approval, allocation, schedule, inspection submission, certificate generation, revocation) is permanently logged with user email, timestamp, IP, and state transition diffs!

---

## 8. Compliance with Government Design Standards

* **Color Palette:** Navy `#002147`, Slate `#1B365D`, Ashoka Blue `#0B4F6C`, subtle Indian Tricolor accent strip.
* **Typography:** Inter & Merriweather (crisp, dignified, high contrast).
* **Accessibility:** Text size scaler (`A-`, `A`, `A+`), high-contrast status pills, screen reader aria tags, National Consumer Helpline `1800-11-4000`.
* **Zero Startup/Crypto Gimmicks:** No glassmorphism, no flashy neon gradients, no cryptocurrency themes. Structured government tables, official circular notices, and statutory language throughout.
