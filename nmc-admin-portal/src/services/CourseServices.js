import requests from './httpService';

const CourseServices = {
  getAllCourses: async (params = {}) => {
    return requests.get('/courses', { params });
  },

  getCourseById: async (id) => {
    return requests.get(`/courses/${id}`);
  },

  addCourse: async (body) => {
    return requests.post('/courses', body);
  },

  updateCourse: async (id, body) => {
    return requests.put(`/courses/${id}`, body);
  },

  deleteCourse: async (id) => {
    return requests.delete(`/courses/${id}`);
  },
};

export default CourseServices;
