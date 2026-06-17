const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Định nghĩa các route xử lý giao dịch đặt vé & thanh toán
router.post("/", bookingController.create);

module.exports = router;
