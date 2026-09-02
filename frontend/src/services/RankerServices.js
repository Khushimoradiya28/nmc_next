import requests from './httpService';

const RankerServices = {
  // Public list (active only). High limit to load all for client-side grouping/filtering.
  getAllRankers: async ({ page = 1, limit = 500, search = '', programme = '', academicYear = '', semesterYear = '', status = 'active' } = {}) => {
    return requests.get('/rankers', { page, limit, search, programme, academicYear, semesterYear, status });
  },

  getRankerByIdOrSlug: async (idOrSlug) => {
    return requests.get(`/rankers/${idOrSlug}`);
  },
};

export default RankerServices;
