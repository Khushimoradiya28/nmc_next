import requests from './httpService';

const TestimonialServices = {
  // 1. Get List (Filtered by type: 'student' or 'dignitary')
  getTestimonials: async ({ type = '', search = '', isActive = '' } = {}) => {
    let url = `/testimonials?`;
    const params = [];
    if (type) params.push(`type=${encodeURIComponent(type)}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (isActive !== '') params.push(`isActive=${encodeURIComponent(isActive)}`);
    return requests.get(url + params.join('&'));
  },

  getAllTestimonials: async (params = {}) => {
    return requests.get('/testimonials', params);
  },

  // 2. Get Single Testimonial by Slug or ID
  getTestimonialById: async (idOrSlug) => {
    return requests.get(`/testimonials/${idOrSlug}`);
  },

  // 3. Add Testimonial (FormData or JSON)
  addTestimonial: async (body) => {
    const isFormData = body instanceof FormData;
    return requests.post('/testimonials', body, isFormData ? { 'Content-Type': 'multipart/form-data' } : {});
  },

  // 4. Update Testimonial (by Slug or ID)
  updateTestimonial: async (idOrSlug, body) => {
    const isFormData = body instanceof FormData;
    return requests.put(`/testimonials/${idOrSlug}`, body, isFormData ? { 'Content-Type': 'multipart/form-data' } : {});
  },

  // 5. Delete Testimonial (Soft Delete)
  deleteTestimonial: async (idOrSlug) => {
    return requests.delete(`/testimonials/${idOrSlug}`);
  },
};

export default TestimonialServices;
