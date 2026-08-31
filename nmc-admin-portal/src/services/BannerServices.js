import requests from './httpService';

const BannerServices = {
  getAllBanners: async ({ page = 1, limit = 50, search = '', status = '' } = {}) => {
    let url = '/banners?page=' + page + '&limit=' + limit;
    if (search && search.trim()) url += '&search=' + encodeURIComponent(search.trim());
    if (status && status !== 'all') url += '&status=' + encodeURIComponent(status);
    return requests.get(url);
  },

  getBannerById: async (id) => {
    return requests.get('/banners/' + id);
  },

  addBanner: async (formData) => {
    return requests.post('/banners', formData, { 'Content-Type': 'multipart/form-data' });
  },

  updateBanner: async (id, formData) => {
    return requests.put('/banners/' + id, formData, { 'Content-Type': 'multipart/form-data' });
  },

  updateBannerStatus: async (id, status) => {
    return requests.put('/banners/' + id, { status });
  },

  deleteBanner: async (id) => {
    return requests.delete('/banners/' + id);
  },
};

export default BannerServices;
