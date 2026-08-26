import requests from './masterService.js';

const UserRoleServices = {
  getAllUserRoles(body) {
    const payload = {
      status: 1,
      ...body
    };
    return requests.post('/role/list', payload);
  },

  addData(data) {
    return requests.post('/role/add', data, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
  },

  getBrandById(id) {
    return requests.post('/role/list', { _id: id });
  },

  updateBrand(id, data, token) {
    const payload = {
      id: id,
      ...data
    };

    return requests.post('/role/update', payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });
  },
  deleteData(id) {
    return requests.post('/role/delete', { id: id });
  }

};

export default UserRoleServices;


