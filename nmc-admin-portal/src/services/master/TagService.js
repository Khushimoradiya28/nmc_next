import requests from './masterService.js';

const TagService = {
  getAllData(body) {
    const payload = {
      status: 1,
      ...body
    };

    return requests.post('/tag/list', payload);
  },


  addData(data) {
    return requests.post('/tag/add', data, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
  },

  getBrandById(id) {
    return requests.post('/tag/list', { _id: id });
  },

  updateBrand(id, data, token) {
    const payload = {
      id: id,
      ...data
    };

    return requests.post('/tag/update', payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });
  },
  deleteData(id) {
    return requests.post('/tag/delete', { id: id });
  }

};

export default TagService;


