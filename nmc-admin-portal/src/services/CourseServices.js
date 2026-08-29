import requests from './httpService';

const CourseServices = {
  // 1. Get All Courses List (default fetch all including active & inactive in admin)
  getAllCourses: async ({ page = 1, limit = 50, search = '', status = '' } = {}) => {
    let url = `/certificate-courses?page=${page}&limit=${limit}`;
    if (search && search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
    if (status && status !== 'all') url += `&status=${encodeURIComponent(status)}`;
    return requests.get(url);
  },

  // 2. Get Single Course by Slug or ID
  getCourseById: async (idOrSlug) => {
    return requests.get(`/certificate-courses/${idOrSlug}`);
  },

  // 3. Add New Course (FormData with Image)
  addCourse: async (body) => {
    return requests.post('/certificate-courses', body, { 'Content-Type': 'multipart/form-data' });
  },

  // 4. Update Course (by Slug or ID)
  updateCourse: async (idOrSlug, body) => {
    const isFormData = body instanceof FormData;
    return requests.put(
      `/certificate-courses/${idOrSlug}`,
      body,
      isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    );
  },

  // 5. Delete Course (Soft Delete)
  deleteCourse: async (idOrSlug) => {
    return requests.delete(`/certificate-courses/${idOrSlug}`);
  },
};

export default CourseServices;
