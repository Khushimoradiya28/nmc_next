import requests from './httpService';

const GalleryServices = {
  getActiveGalleries: async (params = {}) => {
    try {
      return await requests.get('/galleries', { status: 'active', limit: 100, ...params });
    } catch (err) {
      console.error('Error fetching galleries:', err);
      return { success: false, data: [] };
    }
  },

  getAllGalleries: async (params = {}) => {
    try {
      return await requests.get('/galleries', params);
    } catch (err) {
      console.error('Error fetching all galleries:', err);
      return { success: false, data: [] };
    }
  },
};

export default GalleryServices;
