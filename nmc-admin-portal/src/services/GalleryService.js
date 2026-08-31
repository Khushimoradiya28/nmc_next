import requests from './httpService';

const GalleryService = {
  // 1. Get All Gallery Items List (with filters)
  getAllGallery: async ({ page = 1, limit = 50, search = '', category = '', media_type = '', status = '' } = {}) => {
    let url = '/gallery?page=' + page + '&limit=' + limit;
    if (search && search.trim()) url += '&search=' + encodeURIComponent(search.trim());
    if (category && category !== 'All' && category !== 'all') url += '&category=' + encodeURIComponent(category);
    if (media_type && media_type !== 'All' && media_type !== 'all') url += '&media_type=' + encodeURIComponent(media_type);
    if (status && status !== 'all') url += '&status=' + encodeURIComponent(status);
    return requests.get(url);
  },

  // 2. Get Single Gallery Item
  getGalleryById: async (id) => {
    return requests.get('/gallery/' + id);
  },

  // 3. Add Gallery Media (FormData with file)
  addGallery: async (formData) => {
    return requests.post('/gallery', formData, { 'Content-Type': 'multipart/form-data' });
  },

  // 4. Update Gallery Media
  updateGallery: async (id, formData) => {
    return requests.put('/gallery/' + id, formData, { 'Content-Type': 'multipart/form-data' });
  },

  // 5. Update Status Only
  updateGalleryStatus: async (id, status) => {
    return requests.put('/gallery/' + id, { status });
  },

  // 6. Delete Gallery Media (Soft Delete)
  deleteGallery: async (id) => {
    return requests.delete('/gallery/' + id);
  },
};

export default GalleryService;
