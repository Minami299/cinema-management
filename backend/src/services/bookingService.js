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
      const showtime = await Showtime.findById(showtimeId).session(session);
      if (!showtime) throw new Error("Suất chiếu không tồn tại.");

      const requestedSeats = tickets.map((t) => t.seatNumber);
      for (let seat of showtime.seatStatus) {
        if (requestedSeats.includes(seat.seatNumber)) {
          if (seat.status === "Booked")
            throw new Error(`Ghế ${seat.seatNumber} đã bị đặt.`);
          seat.status = "Booked";
        }
      }
      await showtime.save({ session });

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
      return newBooking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getUserBookingHistory(userId) {
    return await Booking.find({ user: userId })
      .populate({
        path: "showtime",
        populate: [
          { path: "movie", select: "title posterUrl" },
          { path: "cinema", select: "name" },
          { path: "room", select: "name" },
        ],
      })
      .populate("foods.foodItem")
      .sort({ createdAt: -1 });
  }

  async getAllBookingsFromDB(filters = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    return await Booking.find(query)
      .populate("user", "name email phone")
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

  async updateBookingStatusInDB(id, updateData) {
    const { status, paymentStatus } = updateData;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields["payment.status"] = paymentStatus;
    if (paymentStatus === "Completed")
      updateFields["payment.paidAt"] = new Date();

    return await Booking.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true },
    );
  }
}

module.exports = new BookingService();
