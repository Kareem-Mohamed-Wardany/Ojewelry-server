const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage(); // Files will be stored in memory (buffer)
const upload = multer({ storage });
const typeAuth = require("../../middleware/type-auth")
const isAuth = require("../../middleware/is-auth")

const {
  addHeroImage,
  getHeroImage,
  deleteHeroImage,
  changeHeroImageActive
} = require("../../controllers/common/hero-controller");

const router = express.Router();

router.post("/add", upload.single("img"), addHeroImage);
router.get("/change-active/:id", changeHeroImageActive);
router.get("/get/:active", getHeroImage);
router.get("/delete/:id", deleteHeroImage);

module.exports = router;
