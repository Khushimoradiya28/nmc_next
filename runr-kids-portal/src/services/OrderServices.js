import requests from './httpService';

const OrderServices = {
  // getAllOrders1(body, headers) {
  //   return requests.get('/orders', body, headers);
  // },
  getAllOrders1(body) {
    const payload = { ...body }; // include type, id, etc
    return requests.post('/order/list', payload);
  },

  // getAllOrders(data) {
  //   // 'data' will correctly receive { type: "order_list" }
  //   return requests.post('/order/list', data);
  // },

  getAllOrders(body) {
    const payload = {
      status: 1,
      ...body
    };
    return requests.post('/order/list', payload);
  },
  getOrderByID: async (id) => {
    try {
      // NOTE: Adjust the endpoint path if necessary!
      const response = await requests.get(`/orders/${id}`);
      return response.data; // Should return the { status, count, data: [order] } object
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },
  getAvailableOrder(body, headers) {
    return requests.get('/orders/available', body, headers);
  },

  getOrderByUser(id, body) {
    return requests.get(`/orders/user/${id}`, body);
  },

  getOrderById(id, body) {
    return requests.get(`/orders/${id}`, body);
  },

  updateOrder(id, body, headers) {
    return requests.put(`/orders/${id}`, body, headers);
  },

  deleteOrder(id) {
    return requests.delete(`/orders/${id}`);
  },

  getAllOrderstatus(data) {
    return requests.post('/order/manage-order', data);
  },

};

export default OrderServices;
