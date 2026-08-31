import requests from './httpService';

const BannerServices = {
  getActiveBanners: async () => {
    try {
      return await requests.get('/banners', { status: 'active' });
    } catch (err) {
      console.error('Error fetching active banners:', err);
      return { success: false, data: [] };
    }
  },

  getAllBanners: async (params = {}) => {
    try {
      return await requests.get('/banners', params);
    } catch (err) {
      console.error('Error fetching banners:', err);
      return { success: false, data: [] };
    }
  },
};

export default BannerServices;
