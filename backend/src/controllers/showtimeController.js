const showtimeService = require("../services/showtimeService");

class ShowtimeController {
  async create(req, res) {
    try {
      const newShowtime = await showtimeService.createShowtime(req.body);
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

  async getAll(req, res) {
    try {
      const showtimes = await showtimeService.getAllShowtimes();
      return res.status(200).json({ success: true, data: showtimes });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByMovie(req, res) {
    try {
      const showtimes = await showtimeService.getShowtimesByMovie(
        req.params.movieId,
      );
      return res.status(200).json({ success: true, data: showtimes });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByCinema(req, res) {
    try {
      const showtimes = await showtimeService.getShowtimesByCinema(
        req.params.cinemaId,
      );
      return res.status(200).json({ success: true, data: showtimes });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const showtime = await showtimeService.getShowtimeById(req.params.id);
      if (!showtime) {
        return res
          .status(404)
          .json({ success: false, message: "Suất chiếu không tồn tại." });
      }
      return res.status(200).json({ success: true, data: showtime });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const updatedShowtime = await showtimeService.updateShowtime(
        req.params.id,
        req.body,
      );
      return res.status(200).json({ success: true, data: updatedShowtime });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedShowtime = await showtimeService.deleteShowtime(
        req.params.id,
      );
      if (!deletedShowtime) {
        return res
          .status(404)
          .json({ success: false, message: "Suất chiếu không tồn tại." });
      }
      return res
        .status(200)
        .json({ success: true, message: "Xóa suất chiếu thành công." });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ShowtimeController();
