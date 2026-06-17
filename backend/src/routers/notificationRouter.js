const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/", notificationController.create);
router.get("/user/:userId", notificationController.getByUserId);
router.get("/user/:userId/unread", notificationController.getUnread);
router.get("/user/:userId/count", notificationController.getUnreadCount);
router.get("/:id", notificationController.getById);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/user/:userId/read-all", notificationController.markAllAsRead);
router.delete("/:id", notificationController.delete);
router.delete("/user/:userId/all", notificationController.deleteAll);

module.exports = router;
