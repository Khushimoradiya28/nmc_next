import requests from './httpService';

const TestimonialServices = {
  getTestimonials: async ({ type = '', search = '', isActive = 'true' } = {}) => {
    return requests.get('/testimonials', { type, search, isActive });
  },

  getDignitaryTestimonials: async () => {
    return requests.get('/testimonials', { type: 'dignitary', isActive: 'true' });
  },

  getStudentTestimonials: async () => {
    return requests.get('/testimonials', { type: 'student', isActive: 'true' });
  },

  getTestimonialById: async (idOrSlug) => {
    return requests.get(`/testimonials/${idOrSlug}`);
  },
};

export default TestimonialServices;