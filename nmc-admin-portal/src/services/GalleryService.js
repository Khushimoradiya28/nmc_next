import requests from './httpService';

const GalleryService = {
  addGallery(formData) {
    // POST multipart/form-data to add a gallery image
    return requests.post("/gallery/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteGallery(id) {
    // DELETE (or POST with JSON body) depending on your backend
    return requests.post("/gallery/delete", { id });
  },

  getGalleryByProduct(productId) {
    // optional: if you want a service method to get gallery images by product
    return requests.get(`/gallery/product/${productId}`);
  },
};

export default GalleryService;
