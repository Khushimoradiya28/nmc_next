import requests from './httpService';

const CourseServices = {
  /**
   * Get dynamic combined dropdown list of Academic Programs & Professional Certificate Courses
   */
  getCourseDropdown: async () => {
    return requests.get('/courses/dropdown');
  },

  /**
   * Get all active Professional Certificate Courses
   */
  getAllCourses: async ({ page = 1, limit = 50, search = '', status = 'active' } = {}) => {
    const params = { page, limit, status };
    if (search && search.trim()) params.search = search.trim();
    return requests.get('/certificate-courses', params);
  },

  /**
   * Alias for getAllCertificateCourses
   */
  getAllCertificateCourses: async ({ page = 1, limit = 50, search = '', status = 'active' } = {}) => {
    const params = { page, limit, status };
    if (search && search.trim()) params.search = search.trim();
    return requests.get('/certificate-courses', params);
  },

  /**
   * Get Certificate Course by slug or ID
   */
  getCourseBySlug: async (slugOrId) => {
    return requests.get(`/certificate-courses/${slugOrId}`);
  },
};

export default CourseServices;
