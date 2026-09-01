import requests from "./httpService";

const UserServices = {
  getAllUsers(params = {}) {
    return requests.get(`/user/list`, { params });
  },
  getUserById(id) {
    return requests.get(`/user/${id}`);
  },

  deleteUser(id) {
    return requests.delete(`/user/${id}`);
  },
};

export default UserServices;
