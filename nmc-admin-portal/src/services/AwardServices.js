import requests from './httpService';

const AwardServices = {
  // 1. Get All Awards List
  getAllAwards: async ({ page = 1, limit = 10, search = '', status = 'active' } = {}) => {
    return requests.get(`/awards?page=${page}&limit=${limit}&search=${search}&status=${status}`);
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
