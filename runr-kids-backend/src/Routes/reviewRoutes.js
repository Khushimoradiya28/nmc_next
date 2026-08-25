const express = require("express");
const router = express.Router();
const reviewController = require("../Controller/reviewController");
const { getReviewUpload } = require("../Utils/multerStorage");
const { validateInput } = require("../Middleware/inputValidator");

const upload = getReviewUpload();

router.post(
  "/add",
  (req, res, next) => {
    upload.array("media", 10)(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File exceeds the 10MB limit!",
          });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
           return res.status(400).json({
             success: false,
             message: "Too many files! Maximum 10 allowed.",
           });
        }
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  validateInput,
  reviewController.addReview
);

router.post("/get-reviews", reviewController.getProductReviews);
router.post("/update", reviewController.updateReview);
router.post("/delete", reviewController.deleteReview);

module.exports = router;
