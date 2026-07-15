const bookingService = require("../services/bookingService");

class BookingController {
  async create(req, res) {
    try {
      // Giả định bạn có Auth Middleware nạp thông tin user vào req.user._id
      // Nếu chưa có hệ thống Auth, tạm thời lấy từ body hoặc dùng 1 ID giả định
      const userId = req.body.userId || "65f1a2b3c4d5e6f7a8b9c0d1";

      const booking = await bookingService.createBooking(userId, req.body);
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getHistory(req, res) {
    try {
      const userId = req.params.userId;
      const history = await bookingService.getUserBookingHistory(userId);
      res.status(200).json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  async getAll(req, res) {
    try {
      const bookings = await bookingService.getAllBookings();
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
        return res.status(400).json({ success: false, message: "Trạng thái vé không hợp lệ." });
      }
      const booking = await bookingService.updateBookingStatus(req.params.id, status);
      if (!booking) return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt vé." });
      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new BookingController();
