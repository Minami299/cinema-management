const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.post("/", authMiddleware, bookingController.create);
router.get("/history/:userId", authMiddleware, bookingController.getHistory);

router.get(
  "/all",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  bookingController.getAllBookings,
);
router.get(
  "/revenue",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  bookingController.getRevenueReport,
);
router.put(
  "/:id/status",
  authMiddleware,
  authorizeRoles("ADMIN"),
  bookingController.updateBookingStatus,
);

module.exports = router;
