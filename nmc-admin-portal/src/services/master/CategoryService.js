import requests from './masterService.js';

const CategoryService = {
  getAllBrands(body) {
    const payload = {
      // status: 1,
      ...body
    };
    return requests.post('/category/list', payload);
  },

  addBrand(formData) {
    return requests.post('/category/add', formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      });
  },

  getBrandById(id) {
    return requests.post('/category/list', { _id: id });
  },

  updateBrand(id, body, token) {
    body.append("id", id);

    return requests.post(`/category/update`, body, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteData(id) {
    return requests.post('/category/delete', { id: id });
  }

};

export default CategoryService;


