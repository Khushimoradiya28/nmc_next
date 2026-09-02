import axios from 'axios';
import Cookies from 'js-cookie';
import requests from './httpService';

// Dedicated axios instance for bulk upload (needs onUploadProgress support)
const bulkInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 500000,
});
bulkInstance.interceptors.request.use((config) => {
  const token = Cookies.get('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const GoldMedalistServices = {
  // 1. Get All Gold Medalists (supports pagination, search, programme & academicYear filters)
  getAllMedalists: async ({ page = 1, limit = 10, search = '', programme = '', academicYear = '', status = '' } = {}) => {
    let url = `/gold-medalists?page=${page}&limit=${limit}`;
    if (search && search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
    if (programme && programme !== 'all') url += `&programme=${encodeURIComponent(programme)}`;
    if (academicYear && academicYear !== 'all') url += `&academicYear=${encodeURIComponent(academicYear)}`;
    if (status && status !== 'all') url += `&status=${encodeURIComponent(status)}`;
    return requests.get(url);
  },

  // 2. Get Single Gold Medalist by Slug or ID
  getMedalistByIdOrSlug: async (idOrSlug) => {
    return requests.get(`/gold-medalists/${idOrSlug}`);
  },

  // 3. Add Gold Medalist (multipart/form-data with image)
  addMedalist: async (formData) => {
    return requests.post('/gold-medalists', formData, { 'Content-Type': 'multipart/form-data' });
  },

  // 4. Update Gold Medalist (by Slug or ID, multipart/form-data)
  updateMedalist: async (idOrSlug, formData) => {
    return requests.put(`/gold-medalists/${idOrSlug}`, formData, { 'Content-Type': 'multipart/form-data' });
  },

  // 5. Delete Gold Medalist (Soft Delete)
  deleteMedalist: async (idOrSlug) => {
    return requests.delete(`/gold-medalists/${idOrSlug}`);
  },

  // 6. Bulk Validate (audit) a CSV file. onProgress reports upload % (0-100).
  bulkValidate: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await bulkInstance.post('/gold-medalists/bulk-validate', formData, {
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      },
    });
    return res.data;
  },

  // 7. Bulk Import already-validated rows: rows = [{ row, data }]
  bulkImport: async (rows) => {
    return requests.post('/gold-medalists/bulk-import', { rows });
  },
};

export default GoldMedalistServices;
