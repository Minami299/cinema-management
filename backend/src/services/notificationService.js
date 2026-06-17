const Notification = require("../models/Notification");

class NotificationService {
  async createNotification(notificationData) {
    const newNotification = new Notification(notificationData);
    return await newNotification.save();
  }

  async getNotificationsByUserId(userId, limit = 10) {
    return await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getUnreadNotifications(userId) {
    return await Notification.find({ userId, isRead: false }).sort({
      createdAt: -1,
    });
  }

  async getNotificationById(id) {
    return await Notification.findById(id);
  }

  async markAsRead(id) {
    return await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async deleteNotification(id) {
    return await Notification.findByIdAndDelete(id);
  }

  async deleteAllNotifications(userId) {
    return await Notification.deleteMany({ userId });
  }

  async getUnreadCount(userId) {
    return await Notification.countDocuments({ userId, isRead: false });
  }

  async deleteOldNotifications(userId, days = 30) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return await Notification.deleteMany({
      userId,
      createdAt: { $lt: date },
    });
  }
}

module.exports = new NotificationService();
