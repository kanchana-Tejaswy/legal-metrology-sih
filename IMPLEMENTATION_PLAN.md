# Implementation Plan - SIH 26036: Online Verification System for Weighing and Measuring Instruments

## Overview
We are building a **production-grade, responsive, government-style web application** for **SIH 26036 – Development of an Online Verification System for Weighing and Measuring Instruments**, adhering strictly to the official Indian Legal Metrology domain model, Department of Consumer Affairs guidelines, and professional government portal design standards (National Portal of India / NIC inspired).

The system digitizes the entire lifecycle of instrument verification across 4 distinct roles:
1. **Instrument Owner / Business Owner**
2. **Legal Metrology Officer (LMO)**
3. **Government Approved Test Centre (GATC)**
4. **Department Administrator**

---

## Directory Structure to Create
```
c:/Users/SRIRAM KAVADI/Downloads/sih/
├── backend/
│   ├── src/
│   │   ├── config/             # Environment, Supabase client, DB config
│   │   ├── controllers/        # Auth, Instruments, Applications, Verifications, Certificates, Audit
│   │   ├── middleware/         # JWT Auth, RBAC, Validation, Error Handler
│   │   ├── models/             # Schema definitions, DB access layer (Supabase / Postgres + in-memory store)
│   │   ├── routes/             # REST API routes
│   │   ├── services/           # PDF Generation, QR Code Generation, Notification service, Audit logger
│   │   ├── utils/              # ID generators (LM-APP-..., CERT-...), Date utils
│   │   └── server.js           # Express App entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/                 # Icons, SVG emblems, static assets
│   ├── src/
│   │   ├── assets/             # Brand logos, official seal SVG
│   │   ├── components/         # Government Header, Footer, Navbar, Breadcrumbs, StatusBadge, Modal, QRScanner/Display, DataTable, Alerts
│   │   ├── context/            # AuthContext (JWT, user, role, approval state), NotificationContext
│   │   ├── pages/
│   │   │   ├── public/         # Home, About, Services, QR Public Verify (/verify/:certId), Certificate Lookup
│   │   │   ├── auth/           # Login, Register (with Stakeholder PENDING status notice)
│   │   │   ├── owner/          # Owner Dashboard, My Instruments, Instrument Register, Apply Verification, Certificates, History
│   │   │   ├── lmo/            # LMO Dashboard, Assigned List, Verification Workspace (Mobile/Field-friendly), History
│   │   │   ├── gatc/           # GATC Dashboard, Assigned List, Verification Workspace, History
│   │   │   └── admin/          # Admin Dashboard, Stakeholder Approvals, Allocation, Scheduling, LMO/GATC Scope, Audit Logs, Certificate Revocation
│   │   ├── services/           # API Client (Axios/fetch with JWT interceptor)
│   │   ├── App.jsx             # React Router with role guards
│   │   ├── main.jsx
│   │   └── index.css           # Government styling design system (Navy/White, Gov typography, subtle borders, high contrast)
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── database/
│   ├── schema.sql              # Complete PostgreSQL / Supabase Schema (12 tables, indexes, constraints, RLS policies)
│   ├── seed.sql                # Seed data (Demo accounts: Admin, Owner, LMO, GATC, sample instruments, applications, certificates)
│   └── storage_setup.sql       # Supabase Storage bucket definitions (documents, photos, certificates, evidence)
└── README.md                   # Complete architectural guide, setup instructions, workflow demo guide
```
