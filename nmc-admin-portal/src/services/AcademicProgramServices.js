import requests from './httpService';

const AcademicProgramServices = {
  // 1. Get All Programs (supports pagination & query filters)
  getAllPrograms: async ({ page = 1, limit = 50, search = '', status = '', programType = '' } = {}) => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append('page', page);
    if (limit) searchParams.append('limit', limit);
    if (search) searchParams.append('search', search);
    if (status && status !== 'all') searchParams.append('status', status);
    if (programType && programType !== 'all') searchParams.append('programType', programType);
    return requests.get(`/academic-programs?${searchParams.toString()}`);
  },

  // 2. Get Program by Slug or ID
  getProgramById: async (slugOrId) => {
    return requests.get(`/academic-programs/${slugOrId}`);
  },

  // 3. Add Program
  addProgram: async (body) => {
    return requests.post('/academic-programs', body);
  },

  // 4. Update Program
  updateProgram: async (slugOrId, body) => {
    return requests.put(`/academic-programs/${slugOrId}`, body);
  },

  // 5. Delete Program (Soft Delete)
  deleteProgram: async (slugOrId) => {
    return requests.delete(`/academic-programs/${slugOrId}`);
  },
};

export default AcademicProgramServices;
