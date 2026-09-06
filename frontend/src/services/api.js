const API_BASE = '/api';

/**
 * Universal Fetch Helper with JWT Authentication
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('lm_auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If unauthorized, notify
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('lm_auth_token');
        localStorage.removeItem('lm_auth_user');
      }
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/auth/profile'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Instruments
  getInstruments: (params = '') => request(`/instruments${params ? `?${params}` : ''}`),
  getInstrumentById: (id) => request(`/instruments/${id}`),
  createInstrument: (data) => request('/instruments', { method: 'POST', body: JSON.stringify(data) }),
  getCategories: () => request('/instruments/categories'),

  // Applications
  getApplications: (params = '') => request(`/applications${params ? `?${params}` : ''}`),
  getApplicationById: (id) => request(`/applications/${id}`),
  createApplication: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),

  // Allocation & Scheduling (Admin)
  assignApplication: (id, data) => request(`/applications/${id}/assign`, { method: 'POST', body: JSON.stringify(data) }),
  scheduleVerification: (id, data) => request(`/applications/${id}/schedule`, { method: 'POST', body: JSON.stringify(data) }),

  // Verification (LMO / GATC)
  getVerificationWorkspace: (id) => request(`/verifications/${id}/workspace`),
  submitVerification: (id, data) => request(`/verifications/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }),

  // Certificates
  getCertificates: (params = '') => request(`/certificates${params ? `?${params}` : ''}`),
  getCertificateById: (id) => request(`/certificates/${id}`),
  revokeCertificate: (id, data) => request(`/certificates/${id}/revoke`, { method: 'POST', body: JSON.stringify(data) }),

  // Public QR Live Verification (No Auth)
  verifyCertificatePublic: (certificateId) => request(`/public/verify/${encodeURIComponent(certificateId)}`),

  // Admin
  getDashboardStats: () => request('/admin/stats'),
  getStakeholders: (params = '') => request(`/admin/stakeholders${params ? `?${params}` : ''}`),
  updateStakeholderStatus: (userId, data) => request(`/admin/stakeholders/${userId}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  getOfficers: () => request('/admin/officers'),
  getAuditLogs: (params = '') => request(`/admin/audit-logs${params ? `?${params}` : ''}`),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' })
};
