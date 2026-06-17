const Showtime = require("../models/Showtime");
const Room = require("../models/Room");

class ShowtimeService {
  async createShowtime(data) {
    // 1. Tìm phòng chiếu để lấy sơ đồ ghế cố định
    const room = await Room.findById(data.room);
    if (!room) {
      throw new Error("Phòng chiếu không tồn tại.");
    }

    // 2. Kiểm tra trùng lịch chiếu (Cùng phòng, cùng ngày, khoảng thời gian chồng lấn)
    const overlapping = await Showtime.findOne({
      room: data.room,
      date: data.date,
      $or: [
        {
          startTime: { $lte: data.startTime },
          endTime: { $gte: data.startTime },
        },
        { startTime: { $lte: data.endTime }, endTime: { $gte: data.endTime } },
      ],
    });
    if (overlapping) {
      throw new Error("Khung giờ này đã có suất chiếu khác trong phòng.");
    }

    // 3. Tự động ánh xạ ghế cố định thành trạng thái ghế trống động cho suất chiếu
    const seatStatus = room.seats.map((seat) => ({
      seatNumber: seat.seatNumber,
      status: "Available",
      lockedBy: null,
      lockedAt: null,
    }));

    // 4. Tạo suất chiếu mới
    const newShowtime = new Showtime({
      ...data,
      seatStatus,
    });
    return await newShowtime.save();
  }

  async getShowtimesByCinema(cinemaId) {
    return await Showtime.find({ cinema: cinemaId })
      .populate("movie", "title duration imageUrl")
      .populate("room", "name type");
  }

  async getShowtimeDetails(id) {
    return await Showtime.findById(id)
      .populate("movie")
      .populate("cinema")
      .populate("room");
  }
}

module.exports = new ShowtimeService();
