import requests from '../master/masterService.js';

const AgeServices = {
  getAllAge(body) {
    const payload = {
      // status: 1,
      ...body
    };
    return requests.post('/age/list', payload);
  },

  //BODY/RAW
  addAge(body, token) {
    return requests.post('/age/add', body, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },

  getAgeById(id) {
    return requests.post('/age/list', { _id: id });
  },

  //BODY/RAW
  updateAge(id, body, token) {
    // body.append("id", id);
    // attach id inside JSON body
    const payload = {
      ...body,
      id: id
    };

    return requests.post('/age/update', payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },

  // updateAge(id, body, token) {
  //   body.append("id", id);

  //   return requests.post(`/age/update`, body, {
  //     headers: {
  //       "Authorization": `Bearer ${token}`,
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // },

  deleteAge(id) {
    return requests.post('/age/delete', { id: id });
  }

};

export default AgeServices;


