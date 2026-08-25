import requests from './httpService';

const TestimonialServices = {
  getAllTestimonials(params = {}) {
    const query = new URLSearchParams(params).toString();
    return requests.get(`/testimonials${query ? `?${query}` : ''}`);
  },

  getTestimonialById(id) {
    return requests.get(`/testimonials/${id}`);
  },

  addTestimonial(body) {
    return requests.post('/testimonials', body);
  },

  updateTestimonial(id, body) {
    return requests.put(`/testimonials/${id}`, body);
  },

  deleteTestimonial(id) {
    return requests.delete(`/testimonials/${id}`);
  },
};

export default TestimonialServices;
