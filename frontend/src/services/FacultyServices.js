import requests from './httpService';

const FacultyServices = {
  // 1. GET Faculty List (Supports search, department, status)
  getAllFaculty: async ({ page = 1, limit = 50, search = '', department = '', status = 'active' } = {}) => {
    return requests.get('/master/faculty', { page, limit, search, department, status });
  },

  // 2. GET Single Faculty Profile Detail by Slug or ID
  getFacultyByIdOrSlug: async (idOrSlug) => {
    return requests.get(`/master/faculty/${idOrSlug}`);
  },
};

export default FacultyServices;
