const express = require("express");
const router = express.Router();
const cinemaController = require("../controllers/cinemaController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Public routes - xem rạp không cần đăng nhập
router.get("/", cinemaController.getAll);
router.get("/city/:city", cinemaController.getByCity);
router.get("/:id", cinemaController.getById);

// Write routes - chỉ ADMIN và MANAGER
router.post("/", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), cinemaController.create);
router.put("/:id", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), cinemaController.update);
router.patch("/:id/status", authMiddleware, authorizeRoles("ADMIN", "MANAGER"), cinemaController.updateStatus);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), cinemaController.delete);

module.exports = router;
