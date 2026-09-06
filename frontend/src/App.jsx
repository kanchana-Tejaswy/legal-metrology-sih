import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { PublicVerifyPage } from './pages/public/PublicVerifyPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PendingApprovalPage } from './pages/auth/PendingApprovalPage';

// Owner Pages
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { MyInstrumentsPage } from './pages/owner/MyInstrumentsPage';
import { RegisterInstrumentPage } from './pages/owner/RegisterInstrumentPage';
import { ApplyVerificationPage } from './pages/owner/ApplyVerificationPage';
import { MyApplicationsPage } from './pages/owner/MyApplicationsPage';
import { MyCertificatesPage } from './pages/owner/MyCertificatesPage';
import { VerificationHistoryPage } from './pages/owner/VerificationHistoryPage';

// LMO Pages
import { LMODashboard } from './pages/lmo/LMODashboard';
import { LMOVerificationPage } from './pages/lmo/LMOVerificationPage';

// GATC Pages
import { GATCDashboard } from './pages/gatc/GATCDashboard';
import { GATCVerificationPage } from './pages/gatc/GATCVerificationPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStakeholdersPage } from './pages/admin/AdminStakeholdersPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminCertificatesPage } from './pages/admin/AdminCertificatesPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="verify" element={<PublicVerifyPage />} />
        <Route path="verify/:certificateId" element={<PublicVerifyPage />} />

        {/* Authentication Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="pending-approval" element={<PendingApprovalPage />} />

        {/* Instrument Owner Protected Routes */}
        <Route
          path="owner"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="owner/instruments"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <MyInstrumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="owner/instruments/register"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <RegisterInstrumentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="owner/apply"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <ApplyVerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="owner/applications"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="owner/certificates"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <MyCertificatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="owner/history"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <VerificationHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Legal Metrology Officer (LMO) Protected Routes */}
        <Route
          path="lmo"
          element={
            <ProtectedRoute allowedRoles={['LMO', 'ADMIN']}>
              <LMODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="lmo/workspace/:id"
          element={
            <ProtectedRoute allowedRoles={['LMO', 'ADMIN']}>
              <LMOVerificationPage />
            </ProtectedRoute>
          }
        />

        {/* Government Approved Test Centre (GATC) Protected Routes */}
        <Route
          path="gatc"
          element={
            <ProtectedRoute allowedRoles={['GATC', 'ADMIN']}>
              <GATCDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="gatc/workspace/:id"
          element={
            <ProtectedRoute allowedRoles={['GATC', 'ADMIN']}>
              <GATCVerificationPage />
            </ProtectedRoute>
          }
        />

        {/* Department Administrator Protected Routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/stakeholders"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminStakeholdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/applications"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/certificates"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminCertificatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAuditLogsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
