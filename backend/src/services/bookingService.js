const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");
const mongoose = require("mongoose");

class BookingService {
  async createBooking(userId, bookingData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { showtimeId, tickets, foods, paymentMethod, totalAmount } =
        bookingData;

      // 1. Tìm suất chiếu và khóa dữ liệu
      const showtime = await Showtime.findById(showtimeId).session(session);
      if (!showtime) throw new Error("Suất chiếu không tồn tại.");

      const requestedSeatNumbers = tickets.map((t) => t.seatNumber);

      // 2. Cập nhật trạng thái ghế trong Showtime (Kiểm tra xem có ghế nào đã bị đặt chưa)
      for (let seat of showtime.seatStatus) {
        if (requestedSeatNumbers.includes(seat.seatNumber)) {
          if (seat.status === "Booked") {
            throw new Error(`Ghế ${seat.seatNumber} đã có người đặt trước.`);
          }
          // Chuyển trạng thái sang Booked
          seat.status = "Booked";
        }
      }
      await showtime.save({ session });

      // 3. Tạo bản ghi Booking
      const newBooking = new Booking({
        user: userId,
        showtime: showtimeId,
        tickets,
        foods,
        totalAmount,
        payment: {
          paymentMethod,
          amount: totalAmount,
          status: paymentMethod === "CASH" ? "Completed" : "Pending",
          paidAt: paymentMethod === "CASH" ? new Date() : null,
        },
        status: paymentMethod === "CASH" ? "Confirmed" : "Pending",
      });

      await newBooking.save({ session });
      await session.commitTransaction();
      session.endSession();

      return newBooking;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getUserBookingHistory(userId) {
    return await Booking.find({ user: userId })
      .populate({
        path: "showtime",
        populate: [
          { path: "movie", select: "title" },
          { path: "cinema", select: "name" },
          { path: "room", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });
  }

  async getAllBookings() {
    return Booking.find()
      .populate("user", "name email phone")
      .populate({ path: "showtime", populate: [
        { path: "movie", select: "title" },
        { path: "cinema", select: "name" },
        { path: "room", select: "name" },
      ] })
      .populate("foods.foodItem", "name")
      .sort({ createdAt: -1 });
  }

  async updateBookingStatus(id, status) {
    const booking = await Booking.findById(id);
    if (!booking) return null;
    booking.status = status;
    if (status === "Confirmed" && booking.payment?.status === "Pending") {
      booking.payment.status = "Completed";
      booking.payment.paidAt = new Date();
    }
    return booking.save();
  }
}

module.exports = new BookingService();
