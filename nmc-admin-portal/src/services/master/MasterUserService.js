import requests from './masterService.js';

const MasterUserService = {
  getAllBrands(body) {
    const payload = {
      status: 1,
      ...body
    };
    return requests.post('/user/list', payload);
  },
  getAllCustomer(body) {
    const payload = {
      status: 1,
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
    return requests.post('/user/list', { _id: id });
  },

  updateBrand(id, body, token) {
    body.append("id", id);

    return requests.post('/user/update', body, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // FIXED NAME ↓↓↓
  deleteData(id) {
    return requests.post('/user/delete', { id });
  },

  changePassword(userId, payload) {
    // payload should contain: old_password, new_password, confirm_password
    return requests.post('/auth/change-password', { id: userId, ...payload });
  }
};

export default MasterUserService;
