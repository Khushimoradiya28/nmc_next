import requests from './httpService';

const ProductServices = {

  getAllStockProduct(data) {
    return requests.post('/product/manage-stock', data);
  },

  // UpdateStockProduct(body, token) {

  //   return requests.post(`/product/update-stock`, body, {
  //     headers: {
  //       "Authorization": `Bearer ${token}`,
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // },

  UpdateStockProduct(payload, token) {
    return requests.post(
      "/product/update-stock",
      payload,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );
  },

  UpdateProductPrice(payload, token) {
    return requests.post(
      "/product/update-price",
      payload,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );
  }

  // UpdateProductPrice(id, payload, token) {
  //   payload.append("id", id);

  //   return requests.post(
  //     "/product/update-price",
  //     payload,
  //     {
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  // }

};

export default ProductServices;
