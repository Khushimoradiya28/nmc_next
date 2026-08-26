import requests from './httpService';

const LeadServices = {
  //  getAllLeads(data) {
  //   return requests.post('/leads/list', data);
  // },

  getAllLeads(body) {
    const payload = {
      status: 1,
      ...body
    };
    return requests.post('/leads/list', payload);
  },

  getStockOutProducts() {
    return requests.get('/products/stock-out');
  },

  getProductById(id) {
    return requests.post(`/products/${id}`);
  },

  // addProduct(body) {
  //   return requests.post('/products/add', body);
  // },

  addProduct(formData) {
    return requests.post('/product/add', formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      });
  },

  addAllProducts(body) {
    return requests.post('/products/all', body);
  },

  updateProduct(id, body) {
    return requests.put(`/products/${id}`, body);
  },

  updateStatus(id, body) {
    return requests.put(`/products/status/${id}`, body);
  },
  getBrandById(id) {
    return requests.post('/product/list', { _id: id });
  },


  // deleteData(id) {
  //   return requests.delete(`/products/${id}`);
  // },
  // FIXED NAME ↓↓↓
  deleteData(id) {
    return requests.post('/product/delete', { id });
  }
};

export default LeadServices;
