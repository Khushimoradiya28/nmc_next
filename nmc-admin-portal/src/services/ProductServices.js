import requests from './httpService';

const ProductServices = {

  getAllProducts(data) {
    return requests.post('/product/productlist', data);
  },

  getProductById(id) {
    return requests.post(`/products/${id}`);
  },


  addProduct(formData) {
    return requests.post('/product/add', formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      });
  },


  UpdateProduct(id, body, token) {
    body.append("id", id);

    return requests.post(`/product/update`, body, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  addAllProducts(body) {
    return requests.post('/products/all', body);
  },

  updateStatus(id, body) {
    return requests.put(`/products/status/${id}`, body);
  },
  getBrandById(id) {
    return requests.post('/product/list', { _id: id });
  },


  deleteData(id) {
    return requests.post('/product/delete', { id });
  },


  //get all dropdown
  // getAllProducts(data) {
  //   return requests.post('/product/productlist', data);
  // },  

  getAllCategories(data) {
    return requests.post('/category/list', data);
  },
  getAllBrands(data) {
    return requests.post('/brand/list', data);
  },
  getAllCharacters(data) {
    return requests.post('/character/list', data);
  },
  getAllTags(data) {
    return requests.post('/tag/list', data);
  },
  getAllAges(data) {
    return requests.post('/age/list', data);
  },
  getAllColor(data) {
    return requests.post('/color/list', data);
  },
  getAllIntrest(data) {
    return requests.post('/material/list', data);
  },
  getAllCommudity(data) {
    return requests.post('/commodity/list', data);
  },
  getAllSkill(data) {
    return requests.post('/skill/list', data);
  },


};

export default ProductServices;
