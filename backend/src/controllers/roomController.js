const roomService = require("../services/roomService");

class RoomController {
  async create(req, res) {
    try {
      const room = await roomService.createRoom(req.body);
      res.status(201).json({ success: true, data: room });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const room = await roomService.getRoomById(req.params.id);
      if (!room) {
        return res
          .status(404)
          .json({ success: false, message: "Phòng chiếu không tồn tại." });
      }
      res.status(200).json({ success: true, data: room });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByCinema(req, res) {
    try {
      const rooms = await roomService.getRoomsByCinema(req.params.cinemaId);
      res.status(200).json({ success: true, data: rooms });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const rooms = await roomService.getAllRooms();
      res.status(200).json({ success: true, data: rooms });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const room = await roomService.updateRoom(req.params.id, req.body);
      if (!room) {
        return res
          .status(404)
          .json({ success: false, message: "Phòng chiếu không tồn tại." });
      }
      res.status(200).json({ success: true, data: room });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const room = await roomService.deleteRoom(req.params.id);
      if (!room) {
        return res
          .status(404)
          .json({ success: false, message: "Phòng chiếu không tồn tại." });
      }
      res
        .status(200)
        .json({ success: true, message: "Xóa phòng chiếu thành công." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getSeats(req, res) {
    try {
      const seats = await roomService.getSeatsForRoom(req.params.id);
      res.status(200).json({ success: true, data: seats });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getCapacity(req, res) {
    try {
      const capacity = await roomService.getRoomCapacity(req.params.id);
      res.status(200).json({ success: true, data: { capacity } });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new RoomController();
