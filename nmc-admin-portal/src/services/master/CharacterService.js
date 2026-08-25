import requests from '../master/masterService.js';

const CharacterServices = {
  getAllCharacters(body) {
    const payload = {
      // status: 1,
      ...body
    };
    return requests.post('/character/list', payload);
  },

  addCharacter(formData) {
    return requests.post('/character/add', formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      });
  },

  getCharacterById(id) {
    return requests.post('/character/list', { _id: id });
  },

  updateCharacter(id, body, token) {
    body.append("id", id);

    return requests.post(`/character/update`, body, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteCharacter(id) {
    return requests.post('/character/delete', { id: id });
  }

};

export default CharacterServices;


