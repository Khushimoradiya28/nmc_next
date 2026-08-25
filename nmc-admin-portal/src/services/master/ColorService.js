import requests from './masterService.js';

const ColorService = {
  getAllData(body) {
    const payload = {
      status: 1,
      ...body
    };
    return requests.post('/color/list', payload);
  },

  addData(data) {
    return requests.post('/color/add', data, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
  },

  getBrandById(id) {
    return requests.post('/color/list', { _id: id });
  },

  updateBrand(id, data, token) {
    const payload = {
      id: id,
      ...data
    };

    return requests.post('/color/update', payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });
  },
  deleteData(id) {
    return requests.post('/color/delete', { id: id });
  }

};

export default ColorService;


