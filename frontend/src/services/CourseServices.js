import requests from './httpService';

const CourseServices = {
  /**
   * Get dynamic combined dropdown list of Academic Programs & Professional Certificate Courses
   */
  getCourseDropdown: async () => {
    return requests.get('/courses/dropdown');
  },
};

export default CourseServices;
