import requests from '../master/masterService.js';

const BrandServices = {
  getAllBrands(body) {
    const payload = {
      // status: 1,
      ...body
    };
    return requests.post('/brand/list', payload);
  },

  addBrand(formData) {
    return requests.post('/brand/add', formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      });
  },

  getBrandById(id) {
    return requests.post('/brand/list', { _id: id });
  },

  updateBrand(id, body, token) {
    body.append("id", id);

    return requests.post(`/brand/update`, body, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteBrand(id) {
    return requests.post('/brand/delete', { id: id });
  }

};

export default BrandServices;


