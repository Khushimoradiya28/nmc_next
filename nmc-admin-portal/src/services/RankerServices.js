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

const RankerServices = {
  // 1. Get all rankers (pagination, search, programme / academicYear / semesterYear filters)
  getAllRankers: async ({ page = 1, limit = 10, search = '', programme = '', academicYear = '', semesterYear = '', status = '' } = {}) => {
    let url = `/rankers?page=${page}&limit=${limit}`;
    if (search && search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
    if (programme && programme !== 'all') url += `&programme=${encodeURIComponent(programme)}`;
    if (academicYear && academicYear !== 'all') url += `&academicYear=${encodeURIComponent(academicYear)}`;
    if (semesterYear && semesterYear !== 'all') url += `&semesterYear=${encodeURIComponent(semesterYear)}`;
    if (status && status !== 'all') url += `&status=${encodeURIComponent(status)}`;
    return requests.get(url);
  },

  // 2. Get single ranker by slug or ID
  getRankerByIdOrSlug: async (idOrSlug) => {
    return requests.get(`/rankers/${idOrSlug}`);
  },

  // 3. Add ranker (multipart/form-data with image)
  addRanker: async (formData) => {
    return requests.post('/rankers', formData, { 'Content-Type': 'multipart/form-data' });
  },

  // 4. Update ranker (by slug or ID, multipart/form-data)
  updateRanker: async (idOrSlug, formData) => {
    return requests.put(`/rankers/${idOrSlug}`, formData, { 'Content-Type': 'multipart/form-data' });
  },

  // 5. Delete ranker (soft delete)
  deleteRanker: async (idOrSlug) => {
    return requests.delete(`/rankers/${idOrSlug}`);
  },

  // 6. Bulk validate (audit) a file. onProgress reports upload % (0-100).
  bulkValidate: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await bulkInstance.post('/rankers/bulk-validate', formData, {
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) onProgress(Math.round((evt.loaded * 100) / evt.total));
      },
    });
    return res.data;
  },

  // 7. Bulk import already-validated rows: rows = [{ row, data }]
  bulkImport: async (rows) => {
    return requests.post('/rankers/bulk-import', { rows });
  },
};

export default RankerServices;
