const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Toàn bộ quản lý role chỉ dành cho ADMIN
router.post("/", authMiddleware, authorizeRoles("ADMIN"), roleController.create);
router.get("/", authMiddleware, authorizeRoles("ADMIN"), roleController.getAll);
router.get("/name/:name", authMiddleware, authorizeRoles("ADMIN"), roleController.getByName);
router.get("/:id", authMiddleware, authorizeRoles("ADMIN"), roleController.getById);
router.put("/:id", authMiddleware, authorizeRoles("ADMIN"), roleController.update);
router.patch("/:id/permissions", authMiddleware, authorizeRoles("ADMIN"), roleController.updatePermissions);
router.post("/:id/permissions", authMiddleware, authorizeRoles("ADMIN"), roleController.addPermission);
router.delete("/:id/permissions", authMiddleware, authorizeRoles("ADMIN"), roleController.removePermission);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), roleController.delete);

module.exports = router;
