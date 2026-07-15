const bookingService = require("../services/bookingService");

class BookingController {
  async create(req, res) {
    try {
      const booking = await bookingService.createBooking(req.user.id, req.body);
      return res
        .status(201)
        .json({ success: true, message: "Đặt vé thành công", data: booking });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getHistory(req, res) {
    try {
      const history = await bookingService.getUserBookingHistory(
        req.params.userId,
      );
      return res.status(200).json({ success: true, data: history });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllBookings(req, res) {
    try {
      const bookings = await bookingService.getAllBookingsFromDB(req.query);
      return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRevenueReport(req, res) {
    try {
      const report = await bookingService.getRevenueReport(req.query);
      return res.status(200).json({ success: true, data: report });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateBookingStatus(req, res) {
    try {
      const updated = await bookingService.updateBookingStatusInDB(
        req.params.id,
        req.body,
      );
      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy đơn hàng" });
      return res
        .status(200)
        .json({
          success: true,
          message: "Cập nhật trạng thái thành công",
          data: updated,
        });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async cancelBooking(req, res) {
    try {
      const booking = await bookingService.cancelBookingByUser(
        req.params.id,
        req.user.id,
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "Hủy vé thành công",
          data: booking,
        });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new BookingController();
