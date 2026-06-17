const Room = require("../models/Room");
const Cinema = require("../models/Cinema");

class RoomService {
  async createRoom(roomData) {
    try {
      // Kiểm tra xem Cinema có tồn tại không
      const cinema = await Cinema.findById(roomData.cinema);
      if (!cinema) {
        throw new Error("Rạp phim không tồn tại.");
      }

      const newRoom = new Room(roomData);
      return await newRoom.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Tên phòng đã tồn tại trong rạp phim này.");
      }
      throw error;
    }
  }

  async getRoomById(id) {
    return await Room.findById(id).populate("cinema");
  }

  async getRoomsByCinema(cinemaId) {
    return await Room.find({ cinema: cinemaId })
      .populate("cinema")
      .sort({ name: 1 });
  }

  async getAllRooms() {
    return await Room.find().populate("cinema").sort({ name: 1 });
  }

  async updateRoom(id, updateData) {
    return await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("cinema");
  }

  async deleteRoom(id) {
    return await Room.findByIdAndDelete(id);
  }

  async getRoomsByType(type) {
    return await Room.find({ type }).populate("cinema").sort({ name: 1 });
  }

  async getSeatsForRoom(roomId) {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Phòng chiếu không tồn tại.");
    return room.seats;
  }

  async getRoomCapacity(roomId) {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Phòng chiếu không tồn tại.");
    return room.totalSeats;
  }
}

module.exports = new RoomService();
