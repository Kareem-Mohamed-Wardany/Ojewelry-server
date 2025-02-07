const express = require("express");
const multer = require("multer");

const {
  addProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} = require("../../controllers/admin/products-controller");


const router = express.Router();
const storage = multer.memoryStorage(); // Files will be stored in memory (buffer)
const upload = multer({ storage });

router.post("/add", upload.single("img"), addProduct);
router.put("/edit/:id", upload.single("img"), editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
