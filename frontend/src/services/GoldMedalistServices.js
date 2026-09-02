import requests from './httpService';

const GoldMedalistServices = {
  // 1. Get Gold Medalists List (public - only active records)
  getAllMedalists: async ({ page = 1, limit = 200, search = '', programme = '', academicYear = '', status = 'active' } = {}) => {
    return requests.get('/gold-medalists', { page, limit, search, programme, academicYear, status });
  },

  // 2. Get Single Gold Medalist by Slug or ID
  getMedalistByIdOrSlug: async (idOrSlug) => {
    return requests.get(`/gold-medalists/${idOrSlug}`);
  },
};

export default GoldMedalistServices;
