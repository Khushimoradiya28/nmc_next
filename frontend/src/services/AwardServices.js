import requests from './httpService';

const AwardServices = {
  // 1. Get Awards List
  getAllAwards: async ({ page = 1, limit = 50, search = '', status = 'active' } = {}) => {
    return requests.get('/awards', { page, limit, search, status });
  },

  // 2. Get Single Award by Slug or ID
  getAwardById: async (idOrSlug) => {
    return requests.get(`/awards/${idOrSlug}`);
  },
};

export default AwardServices;
