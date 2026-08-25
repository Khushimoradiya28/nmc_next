// require("dotenv").config();  
const express = require("express");
const router = express.Router();
const { addProduct, getAllProducts,updateProduct, deleteProduct,getAllProductsList,getAllHomeproductsList,searchProductTitles, bulkImportProducts, bulkImportProductsImages,updateAllProductSEO, manageStockList, updateStock, updatePrice, bulkImportProductsPrice, getLowStockProductsList, exportProductSheet, exportProductImageSheet, getMostViewedProducts} = require("../Controller/productController");
const { getMulterUpload, getExcelUpload } = require("../Utils/multerStorage");
const { validateInput } = require("../Middleware/inputValidator");

const upload = getMulterUpload("product");
const excelUpload = getExcelUpload();

// ✅ Routes
router.post("/add", upload.single("product_img"), validateInput, addProduct);
router.post("/list", getAllProducts);
router.post("/update", upload.single("product_img"), validateInput, updateProduct);
router.post("/delete", deleteProduct);
router.post("/productlist", getAllProductsList);
router.post("/homeproductlist", getAllHomeproductsList);
router.post("/searchproduct", searchProductTitles);
router.post("/bulk-import", excelUpload.single("file"), validateInput, bulkImportProducts);
router.post("/bulk-import-images", excelUpload.single("file"), validateInput, bulkImportProductsImages);
router.post("/bulk-import-prices", excelUpload.single("file"), validateInput, bulkImportProductsPrice);
router.post('/updateproductseo',updateAllProductSEO);
router.post('/manage-stock', manageStockList);
router.post('/update-stock', updateStock);
router.post('/update-price', updatePrice);
router.post('/low-stock-list', getLowStockProductsList);
router.get('/export-product-sheet', exportProductSheet);
router.get('/export-product-image-sheet', exportProductImageSheet);
router.post('/most-viewed-products', getMostViewedProducts);

module.exports = router;
