const showtimeService = require("../services/showtimeService");

class ShowtimeController {
  async create(req, res) {
    try {
      const showtime = await showtimeService.createShowtime(req.body);
      res.status(201).json({ success: true, data: showtime });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getByCinema(req, res) {
    try {
      const showtimes = await showtimeService.getShowtimesByCinema(
        req.params.cinemaId,
      );
      res.status(200).json({ success: true, data: showtimes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const showtime = await showtimeService.getShowtimeDetails(req.params.id);
      if (!showtime)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy suất chiếu" });
      res.status(200).json({ success: true, data: showtime });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ShowtimeController();
