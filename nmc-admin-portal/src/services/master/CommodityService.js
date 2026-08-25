import requests from './masterService.js';

const CommodityService = {
  getAllData(body) {
    const payload = {
      status: 1,
      ...body
    };

    return requests.post('/commodity/list', payload);
  },

  addData(data) {
    return requests.post('/commodity/add', data, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
  },

  getBrandById(id) {
    return requests.post('/commodity/list', { _id: id });
  },

  updateBrand(id, data, token) {
    const payload = {
      id: id,
      ...data
    };

    return requests.post('/commodity/update', payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });
  },
  deleteData(id) {
    return requests.post('/commodity/delete', { id: id });
  }

};

export default CommodityService;


