import requests from './httpService';

const FacultyServices = {
  // 1. GET Table List
  getAllFaculty: async ({ page = 1, limit = 10, search = '', department = '' } = {}) => {
    let url = `/master/faculty?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (department && department !== 'all') url += `&department=${encodeURIComponent(department)}`;
    return requests.get(url);
  },

  // 2. GET Profile Detail
  getFacultyByIdOrSlug: async (idOrSlug) => {
    return requests.get(`/master/faculty/${idOrSlug}`);
  },

  // 3. POST Add Faculty (multipart/form-data)
  addFaculty: async (formData) => {
    return requests.post('/master/faculty', formData, { 'Content-Type': 'multipart/form-data' });
  },

  // 4. PUT Edit Faculty (multipart/form-data)
  updateFaculty: async (idOrSlug, formData) => {
    return requests.put(`/master/faculty/${idOrSlug}`, formData, { 'Content-Type': 'multipart/form-data' });
  },

  // 5. DELETE Faculty
  deleteFaculty: async (idOrSlug) => {
    return requests.delete(`/master/faculty/${idOrSlug}`);
  },
};

export default FacultyServices;
