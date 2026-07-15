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

  async getRevenueReport(filters = {}) {
    const { startDate, endDate, cinemaId, roomId, movieId, status } = filters;
    const query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate({
        path: "showtime",
        populate: [
          { path: "movie", select: "title" },
          { path: "cinema", select: "name" },
          { path: "room", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    const filteredBookings = bookings.filter((booking) => {
      const showtime = booking.showtime;
      if (!showtime) return false;

      let valid = true;
      if (cinemaId && showtime.cinema?._id !== cinemaId) valid = false;
      if (roomId && showtime.room?._id !== roomId) valid = false;
      if (movieId && showtime.movie?._id !== movieId) valid = false;

      if (startDate) {
        const start = new Date(startDate);
        if (showtime.date < start) valid = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (showtime.date > end) valid = false;
      }

      return valid;
    });

    const totalRevenue = filteredBookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || 0),
      0,
    );
    const totalOrders = filteredBookings.length;

    const revenueByCinema = {};
    const revenueByRoom = {};
    const revenueByMovie = {};
    const dailyRevenue = {};

    filteredBookings.forEach((booking) => {
      const showtime = booking.showtime;
      const cinemaName = showtime.cinema?.name || "Unknown";
      const roomName = showtime.room?.name || "Unknown";
      const movieTitle = showtime.movie?.title || "Unknown";
      const dateKey = showtime.date
        ? new Date(showtime.date).toLocaleDateString("vi-VN")
        : "Unknown";

      revenueByCinema[cinemaName] =
        (revenueByCinema[cinemaName] || 0) + (booking.totalAmount || 0);
      revenueByRoom[roomName] =
        (revenueByRoom[roomName] || 0) + (booking.totalAmount || 0);
      revenueByMovie[movieTitle] =
        (revenueByMovie[movieTitle] || 0) + (booking.totalAmount || 0);
      dailyRevenue[dateKey] =
        (dailyRevenue[dateKey] || 0) + (booking.totalAmount || 0);
    });

    return {
      totalRevenue,
      totalOrders,
      revenueByCinema,
      revenueByRoom,
      revenueByMovie,
      dailyRevenue,
      bookings: filteredBookings,
    };
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
