import requests from './httpService';

const AwardServices = {
  getAllAwards: async (params = {}) => {
    return requests.get('/awards', { params });
  },

  getAwardById: async (id) => {
    return requests.get(`/awards/${id}`);
  },

  addAward: async (body) => {
    return requests.post('/awards', body);
  },

  updateAward: async (id, body) => {
    return requests.put(`/awards/${id}`, body);
  },

  deleteAward: async (id) => {
    return requests.delete(`/awards/${id}`);
  },
};

export default AwardServices;
