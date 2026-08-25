import requests from '../master/masterService.js';

const SkillServices = {
  getAllSkill(body) {
    const payload = {
      status: 1,
      ...body
    };
    return requests.post('/skills/list', payload);
  },

  //BODY/RAW
  addSkill(body, token) {
    return requests.post('/skills/add', body, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },

  getSkillById(id) {
    return requests.post('/skills/list', { _id: id });
  },

  //BODY/RAW
  updateSkill(id, body, token) {
    // attach id inside JSON body
    const payload = {
      ...body,
      id: id
    };

    return requests.post('/skills/update', payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },

  deleteSkill(id) {
    return requests.post('/skills/delete', { id: id });
  }

};

export default SkillServices;


