const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Các route đọc thông tin user: chỉ ADMIN hoặc chính user đó (dùng authMiddleware)
router.get("/", authMiddleware, authorizeRoles("ADMIN"), userController.getAll);
router.get("/email/:email", authMiddleware, authorizeRoles("ADMIN"), userController.getByEmail);
router.get("/:id", authMiddleware, userController.getById);
router.get("/:id/favorites", authMiddleware, userController.getFavorites);

// Tạo user mới: chỉ ADMIN
router.post("/", authMiddleware, authorizeRoles("ADMIN"), userController.create);

// Cập nhật user: cần đăng nhập (chính user hoặc ADMIN)
router.put("/:id", authMiddleware, userController.update);
router.patch("/:id/password", authMiddleware, userController.updatePassword);
router.put("/:id/status", authMiddleware, authorizeRoles("ADMIN"), userController.toggleStatus);

// Yêu thích: cần đăng nhập
router.post("/:id/favorites", authMiddleware, userController.addFavorite);
router.delete("/:id/favorites", authMiddleware, userController.removeFavorite);

// Xóa user: chỉ ADMIN
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), userController.delete);

module.exports = router;