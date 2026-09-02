import requests from './httpService';

const CourseServices = {
  /**
   * Get dynamic combined dropdown list of Academic Programs & Professional Certificate Courses
   * Sorted strictly: 1st UG, 2nd PG, 3rd Diploma, then Certificate Courses
   */
  getCourseDropdown: async () => {
    const res = await requests.get('/courses/dropdown');
    if (res && res.data && Array.isArray(res.data)) {
      const typeRank = { ug: 1, pg: 2, diploma: 3 };
      res.data.sort((a, b) => {
        const typeA = (a.course_type === 'academic_program') ? (typeRank[(a.category || '').toLowerCase()] || 4) : 5;
        const typeB = (b.course_type === 'academic_program') ? (typeRank[(b.category || '').toLowerCase()] || 4) : 5;
        return typeA - typeB;
      });
    }
    return res;
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
