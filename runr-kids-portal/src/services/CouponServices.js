import requests from './httpService';

// const CouponServices = {
//   addCoupon(body) {
//     return requests.post('/coupon/add', body);
//   },

//   getAllCoupons() {
//     return requests.get('/coupon');
//   },
//   getCouponById(id) {
//     return requests.get(`/coupon/${id}`);
//   },
//   updateCoupon(id, body) {
//     return requests.put(`/coupon/${id}`, body);
//   },
//   deleteCoupon(id) {
//     return requests.delete(`/coupon/${id}`);
//   },
// };

// export default CouponServices;


// import requests from '../master/masterService.js';

const CouponServices = {
  getAllBrands() {
    return requests.post('/coupon/list');
  },

  addData(formData) {
    return requests.post('/coupon/add', formData, 
      {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  
  getBrandById(id) {
    return requests.post('/coupon/list', { _id: id });
  },
  
  updateBrand(id, data, token) {
    const payload = {
      id: id,
      ...data
    };

    return requests.post('/coupon/update', payload, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });
  }, 

 deleteData(id) {
    return requests.post('/coupon/delete', { id: id });
  }

};

export default CouponServices;


