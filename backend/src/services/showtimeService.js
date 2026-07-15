const Showtime = require("../models/Showtime");
const Room = require("../models/Room");

class ShowtimeService {
  async createShowtime(data) {
    const room = await Room.findById(data.room);
    if (!room) {
      throw new Error("Phòng chiếu không tồn tại.");
    }

    const overlapping = await Showtime.findOne({
      room: data.room,
      date: data.date,
      $or: [
        {
          startTime: { $lte: data.startTime },
          endTime: { $gte: data.startTime },
        },
        {
          startTime: { $lte: data.endTime },
          endTime: { $gte: data.endTime },
        },
      ],
    });

    if (overlapping) {
      throw new Error("Khung giờ này đã có suất chiếu khác trong phòng.");
    }

    const seatStatus = room.seats.map((seat) => ({
      seatNumber: seat.seatNumber,
      status: "Available",
      lockedBy: null,
      lockedAt: null,
    }));

    const newShowtime = new Showtime({
      ...data,
      seatStatus,
    });

    return await newShowtime.save();
  }

  async getAllShowtimes() {
    return await Showtime.find()
      .populate("movie", "title posterUrl")
      .populate("cinema", "name")
      .populate("room", "name type")
      .sort({ date: 1, startTime: 1 });
  }

  async getShowtimeById(id) {
    return await Showtime.findById(id)
      .populate("movie")
      .populate("cinema")
      .populate("room");
  }

  async getShowtimesByMovie(movieId) {
    return await Showtime.find({ movie: movieId }).populate("cinema room");
  }

  async getShowtimesByCinema(cinemaId) {
    return await Showtime.find({ cinema: cinemaId })
      .populate("movie", "title duration posterUrl")
      .populate("room", "name type");
  }

  async updateShowtime(id, updateData) {
    const showtime = await Showtime.findById(id);
    if (!showtime) {
      throw new Error("Suất chiếu không tồn tại.");
    }

    const nextRoom = updateData.room || showtime.room;
    const nextDate = updateData.date || showtime.date;
    const nextStart = updateData.startTime || showtime.startTime;
    const nextEnd = updateData.endTime || showtime.endTime;

    const overlapping = await Showtime.findOne({
      _id: { $ne: id },
      room: nextRoom,
      date: nextDate,
      $or: [
        {
          startTime: { $lte: nextStart },
          endTime: { $gte: nextStart },
        },
        {
          startTime: { $lte: nextEnd },
          endTime: { $gte: nextEnd },
        },
      ],
    });

    if (overlapping) {
      throw new Error("Khung giờ này đã có suất chiếu khác trong phòng.");
    }

    if (updateData.room && updateData.room !== showtime.room.toString()) {
      const room = await Room.findById(updateData.room);
      if (!room) throw new Error("Phòng chiếu mới không tồn tại.");
      showtime.seatStatus = room.seats.map((seat) => ({
        seatNumber: seat.seatNumber,
        status: "Available",
        lockedBy: null,
        lockedAt: null,
      }));
    }

    Object.assign(showtime, updateData);
    return await showtime.save();
  }

  async deleteShowtime(id) {
    return await Showtime.findByIdAndDelete(id);
  }
}

module.exports = new ShowtimeService();
