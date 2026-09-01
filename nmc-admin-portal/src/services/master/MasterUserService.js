import requests from './masterService.js';

const MasterUserService = {
  getAllBrands(body) {
    const payload = {
      status: 'all',
      ...body
    };
    return requests.post('/user/list', payload);
  },
  getAllCustomer(body) {
    const payload = {
      status: 'all',
      ...body
    };
    return requests.post('/user/customer-order-list', payload);
  },

  addBrand(formData) {
    return requests.post('/user/add', formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  getBrandById(id) {
    return requests.post('/user/list', { _id: id, status: 'all' });
  },

  updateBrand(id, body, token) {
    if (body instanceof FormData) {
      body.append("id", id);
      return requests.post('/user/update', body, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : undefined,
        },
      });
    }

    const payload = { id, ...body };
    return requests.post('/user/update', payload);
  },

  updateStatus(id, status) {
    return requests.post('/user/update', { id, status });
  },

  deleteData(id) {
    return requests.post('/user/delete', { id });
  },

  changePassword(userId, payload) {
    return requests.post('/auth/change-password', { id: userId, ...payload });
  }
};

export default MasterUserService;
