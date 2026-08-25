import requests from "./httpService";

const DashboardServices = {
  getAllRevenueSummary(body) {
    return requests.post("/order/revenue-summary");
  },
  getAllOrderStatus(body) {
    return requests.post("/order/order-status", body);
  },
  getAllCategoryStats(body = {}) {
    return requests.post("/order/category-stats", body);
  },
  getAllBrandStats(body = {}) {
    return requests.post("/order/brand-stats", body);
  },
  getAllHightSellingProduct(body = {}) {
    return requests.post("/order/highest-selling-products", body);
  },
  getAllRecentOrders(body = {}) {
    return requests.post("/order/list", body);
  },
  getStockOutProducts() {
    return requests.get("/products/stock-out");
  },
  getLowStockProducts() {
    return requests.post("product/low-stock-list");
  },
};

export default DashboardServices;
