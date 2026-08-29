import requests from './httpService';

const AcademicProgramServices = {
  // 1. Get All Active Programs
  getAllPrograms: async ({ page = 1, limit = 100, search = '', status = 'active', programType = '' } = {}) => {
    const params = { page, limit, status };
    if (search && search.trim()) params.search = search.trim();
    if (programType && programType !== 'all') params.programType = programType;
    return requests.get('/academic-programs', params);
  },

  // 2. Get Program by Slug or ID
  getProgramById: async (slugOrId) => {
    return requests.get(`/academic-programs/${slugOrId}`);
  },
};

export default AcademicProgramServices;
