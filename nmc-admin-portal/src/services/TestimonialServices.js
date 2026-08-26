import requests from './httpService';

const TestimonialServices = {
  // 1. Get List (Filtered by type: 'student' or 'dignitary')
  getTestimonials: async ({ type = 'student', search = '', isActive = '' } = {}) => {
    let url = `/testimonials?type=${type}`;
    if (search) url += `&search=${search}`;
    if (isActive !== '') url += `&isActive=${isActive}`;
    return requests.get(url);
  },

  getAllTestimonials: async (params = {}) => {
    return requests.get('/testimonials', params);
  },

  // 2. Get Single Testimonial by Slug or ID
  getTestimonialById: async (idOrSlug) => {
    return requests.get(`/testimonials/${idOrSlug}`);
  },

  // 3. Add Testimonial (JSON format)
  addTestimonial: async (body) => {
    return requests.post('/testimonials', body);
  },

  // 4. Update Testimonial (by Slug or ID)
  updateTestimonial: async (idOrSlug, body) => {
    return requests.put(`/testimonials/${idOrSlug}`, body);
  },

  // 5. Delete Testimonial (Soft Delete)
  deleteTestimonial: async (idOrSlug) => {
    return requests.delete(`/testimonials/${idOrSlug}`);
  },
};

export default TestimonialServices;
