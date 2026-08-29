import requests from './httpService';

const AwardServices = {
  // 1. Get All Awards List (default fetch all including active & inactive in admin)
  getAllAwards: async ({ page = 1, limit = 50, search = '', status = '' } = {}) => {
    let url = `/awards?page=${page}&limit=${limit}`;
    if (search && search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
    if (status && status !== 'all') url += `&status=${encodeURIComponent(status)}`;
    return requests.get(url);
  },

  // 2. Get Single Award by Slug or ID
  getAwardById: async (idOrSlug) => {
    return requests.get(`/awards/${idOrSlug}`);
  },

  // 3. Add Award (FormData with Image)
  addAward: async (formData) => {
    return requests.post('/awards', formData, { 'Content-Type': 'multipart/form-data' });
  },

  // 4. Update Award (by Slug or ID)
  updateAward: async (idOrSlug, formData) => {
    return requests.put(`/awards/${idOrSlug}`, formData, { 'Content-Type': 'multipart/form-data' });
  },

  // 5. Delete Award (Soft Delete)
  deleteAward: async (idOrSlug) => {
    return requests.delete(`/awards/${idOrSlug}`);
  },
};

export default AwardServices;
