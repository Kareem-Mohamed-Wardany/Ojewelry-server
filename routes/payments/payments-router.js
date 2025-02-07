const express = require("express");
const webhook = require("../../controllers/payments/payments-controller");

const router = express.Router();

router.post("/logger", webhook);

module.exports = router;
