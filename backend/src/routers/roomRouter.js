const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public routes - xem phòng không cần đăng nhập
router.get("/", roomController.getAll);
router.get("/cinema/:cinemaId", roomController.getByCinema);
router.get("/:id", roomController.getById);
router.get("/:id/seats", roomController.getSeats);
router.get("/:id/capacity", roomController.getCapacity);

// Write routes - chỉ ADMIN và MANAGER
router.post("/", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), roomController.create);
router.put("/:id", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), roomController.update);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), roomController.delete);

module.exports = router;
