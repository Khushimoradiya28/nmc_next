import requests from './httpService';

const CertificateCourseServices = {
  /**
   * Get all active Professional Certificate Courses
   */
  getAllCourses: async ({ page = 1, limit = 50, search = '', status = 'active' } = {}) => {
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

export default CertificateCourseServices;
