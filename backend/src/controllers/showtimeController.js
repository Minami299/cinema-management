const Showtime = require("../models/Showtime");

class ShowtimeController {
  async create(req, res) {
    try {
      const { room, date, startTime, endTime } = req.body;

      const isOverlapped = await Showtime.findOne({
        room,
        date: new Date(date),
        $or: [{ startTime: { $lte: endTime }, endTime: { $gte: startTime } }],
      });

      if (isOverlapped) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Khung giờ này phòng đã có suất chiếu khác.",
          });
      }

      // Khởi tạo sơ đồ 60 ghế trống mặc định cho phòng chiếu phim mới
      const seatStatus = [];
      const rows = ["A", "B", "C", "D", "E", "F"];
      for (let row of rows) {
        for (let i = 1; i <= 10; i++) {
          seatStatus.push({ seatNumber: `${row}${i}`, status: "Available" });
        }
      }

      const newShowtime = new Showtime({ ...req.body, seatStatus });
      await newShowtime.save();
      return res
        .status(201)
        .json({
          success: true,
          message: "Tạo suất chiếu mới thành công",
          data: newShowtime,
        });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getByMovie(req, res) {
    try {
      const showtimes = await Showtime.find({
        movie: req.params.movieId,
      }).populate("cinema room");
      return res.status(200).json({ success: true, data: showtimes });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ShowtimeController();
