import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add JWT token to request headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bit_dny_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API Helper Methods
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  registerStaff: (data) => API.post('/auth/register-staff', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
};

export const studentAPI = {
  getProfile: () => API.get('/students/profile'),
  updateProfile: (data) => API.put('/students/profile', data)
};

export const admissionAPI = {
  submitApplication: (data) => API.post('/admissions', data),
  getMyApplication: () => API.get('/admissions/my-application')
};

export const documentAPI = {
  uploadDocument: (formData) => API.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyDocuments: () => API.get('/documents/my-documents'),
  deleteDocument: (id) => API.delete(`/documents/${id}`)
};

export const adminAPI = {
  getApplications: (params) => API.get('/admin/applications', { params }),
  getApplicationById: (id) => API.get(`/admin/applications/${id}`),
  verifyDocument: (id, remarks) => API.put(`/admin/documents/${id}/verify`, { remarks }),
  rejectDocument: (id, remarks) => API.put(`/admin/documents/${id}/reject`, { remarks }),
  updateApplicationStatus: (id, status, adminRemarks) => API.put(`/admin/applications/${id}/status`, { status, adminRemarks }),
  getAdminStats: () => API.get('/admin/stats')
};

export const superAdminAPI = {
  getAdmins: () => API.get('/superadmin/admins'),
  createAdmin: (data) => API.post('/superadmin/admins', data),
  toggleAdminStatus: (id) => API.put(`/superadmin/admins/${id}/status`),
  getDepartments: () => API.get('/superadmin/departments'),
  getPublicDepartments: () => API.get('/superadmin/departments/public'),
  createDepartment: (data) => API.post('/superadmin/departments', data),
  updateDepartmentSeats: (id, data) => API.put(`/superadmin/departments/${id}`, data),
  getAuditLogs: () => API.get('/superadmin/audit-logs'),
  getStats: () => API.get('/superadmin/stats'),
  getLandingContent: () => API.get('/superadmin/landing-content'),
  updateLandingContent: (data) => API.put('/superadmin/landing-content', data),
  addAchievementBanner: (data) => API.post('/superadmin/landing-content/banner', data),
  updateAchievementBanner: (id, data) => API.put(`/superadmin/landing-content/banner/${id}`, data),
  deleteAchievementBanner: (id) => API.delete(`/superadmin/landing-content/banner/${id}`),
  uploadLandingImage: (formData) => API.post('/superadmin/landing-content/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addFeatureCard: (data) => API.post('/superadmin/landing-content/feature', data),
  updateFeatureCard: (id, data) => API.put(`/superadmin/landing-content/feature/${id}`, data),
  deleteFeatureCard: (id) => API.delete(`/superadmin/landing-content/feature/${id}`),
  addCampusPhoto: (data) => API.post('/superadmin/landing-content/gallery', data),
  updateCampusPhoto: (id, data) => API.put(`/superadmin/landing-content/gallery/${id}`, data),
  deleteCampusPhoto: (id) => API.delete(`/superadmin/landing-content/gallery/${id}`)
};

export const notificationAPI = {
  getNotifications: () => API.get('/notifications'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`)
};

export default API;
