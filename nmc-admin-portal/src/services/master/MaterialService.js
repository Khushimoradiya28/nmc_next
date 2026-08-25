import requests from './masterService.js';

const MaterialService = {
  getAllData(body) {
    const payload = {
      status: 1,
      ...body
    };

    return requests.post('/material/list', payload);
  },

  addData(data) {
    return requests.post('/material/add', data, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
  },

  getBrandById(id) {
    return requests.post('/material/list', { _id: id });
  },

  updateBrand(id, data, token) {
    const payload = {
      id: id,
      ...data
    };

    return requests.post('/material/update', payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });
  },
  deleteData(id) {
    return requests.post('/material/delete', { id: id });
  }

};

export default MaterialService;


