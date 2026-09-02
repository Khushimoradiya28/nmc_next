import requests from './httpService';

const GoldMedalistServices = {
  // Public list (active only). High limit to load all for client-side grouping/filtering.
  getAllMedalists: async ({ page = 1, limit = 500, search = '', programme = '', academicYear = '', status = 'active' } = {}) => {
    return requests.get('/gold-medalists', { page, limit, search, programme, academicYear, status });
  },

  getMedalistByIdOrSlug: async (idOrSlug) => {
    return requests.get(`/gold-medalists/${idOrSlug}`);
  },
};

export default GoldMedalistServices;
