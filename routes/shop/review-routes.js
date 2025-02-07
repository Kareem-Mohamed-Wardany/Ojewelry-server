const express = require("express");
const typeAuth = require("../../middleware/type-auth")
const isAuth = require("../../middleware/is-auth")
const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", isAuth, typeAuth("user"), addProductReview);
router.get("/reviews", getProductReviews);

module.exports = router;
