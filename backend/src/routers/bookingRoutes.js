const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Đặt vé: cần đăng nhập (CUSTOMER, STAFF, MANAGER, ADMIN đều có thể)
router.post("/", authMiddleware, bookingController.create);

// Xem danh sách đặt vé: ADMIN, MANAGER, STAFF
// router.get("/", authMiddleware, authorizeRoles("ADMIN", "MANAGER", "STAFF"), bookingController.getAll);

module.exports = router;
