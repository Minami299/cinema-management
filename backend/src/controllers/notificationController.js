const notificationService = require("../services/notificationService");

class NotificationController {
  async create(req, res) {
    try {
      const notification = await notificationService.createNotification(
        req.body,
      );
      res.status(201).json({ success: true, data: notification });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getByUserId(req, res) {
    try {
      const limit = req.query.limit || 10;
      const notifications = await notificationService.getNotificationsByUserId(
        req.params.userId,
        limit,
      );
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUnread(req, res) {
    try {
      const notifications = await notificationService.getUnreadNotifications(
        req.params.userId,
      );
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const notification = await notificationService.getNotificationById(
        req.params.id,
      );
      if (!notification) {
        return res
          .status(404)
          .json({ success: false, message: "Thông báo không tồn tại." });
      }
      res.status(200).json({ success: true, data: notification });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const notification = await notificationService.markAsRead(req.params.id);
      res.status(200).json({ success: true, data: notification });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async markAllAsRead(req, res) {
    try {
      await notificationService.markAllAsRead(req.params.userId);
      res
        .status(200)
        .json({ success: true, message: "Đánh dấu tất cả thông báo đã đọc." });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const notification = await notificationService.deleteNotification(
        req.params.id,
      );
      if (!notification) {
        return res
          .status(404)
          .json({ success: false, message: "Thông báo không tồn tại." });
      }
      res
        .status(200)
        .json({ success: true, message: "Xóa thông báo thành công." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteAll(req, res) {
    try {
      await notificationService.deleteAllNotifications(req.params.userId);
      res
        .status(200)
        .json({ success: true, message: "Xóa tất cả thông báo thành công." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const count = await notificationService.getUnreadCount(req.params.userId);
      res.status(200).json({ success: true, data: { count } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new NotificationController();
