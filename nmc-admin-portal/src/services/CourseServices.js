import requests from './httpService';

const CourseServices = {
  // 1. Get All Courses List
  getAllCourses: async ({ page = 1, limit = 10, search = '', status = 'active' } = {}) => {
    return requests.get(`/certificate-courses?page=${page}&limit=${limit}&search=${search}&status=${status}`);
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
