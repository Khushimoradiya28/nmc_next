import requests from './httpService';

const CourseServices = {
  // 1. Get Certificate Courses List
  getAllCourses: async ({ page = 1, limit = 50, search = '', status = 'active', category = '' } = {}) => {
    return requests.get('/certificate-courses', { page, limit, search, status, category });
  },

  // 2. Get Single Course by Slug or ID
  getCourseById: async (idOrSlug) => {
    return requests.get(`/certificate-courses/${idOrSlug}`);
  },
};

export default CourseServices;
