const express = require("express");
const router = express.Router();

const {
  addtoWishlist,
  updateVisitor,
  removetoWishlist,
  deleteWishlist,
  getAllWishlist,
  getMostFavoriteProducts
} = require("../Controller/productwishlistController");

const { verifyToken } = require("../Middleware/authMiddleware");

router.post("/add", addtoWishlist);
router.post("/remove", removetoWishlist);
router.post("/updatevisitor",updateVisitor);
router.post("/delete",deleteWishlist);
router.post("/list",getAllWishlist);
router.post("/most-favourite-products", verifyToken, getMostFavoriteProducts);

module.exports = router;
