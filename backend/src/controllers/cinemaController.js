const cinemaService = require("../services/cinemaService");

class CinemaController {
  async create(req, res) {
    try {
      const cinema = await cinemaService.createCinema(req.body);
      res.status(201).json({ success: true, data: cinema });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const cinemas = await cinemaService.getAllCinemas();
      res.status(200).json({ success: true, data: cinemas });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const cinema = await cinemaService.getCinemaById(req.params.id);
      if (!cinema) {
        return res
          .status(404)
          .json({ success: false, message: "Rạp phim không tồn tại." });
      }
      res.status(200).json({ success: true, data: cinema });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByCity(req, res) {
    try {
      const cinemas = await cinemaService.getCinemasByCity(req.params.city);
      res.status(200).json({ success: true, data: cinemas });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const cinema = await cinemaService.updateCinema(req.params.id, req.body);
      if (!cinema) {
        return res
          .status(404)
          .json({ success: false, message: "Rạp phim không tồn tại." });
      }
      res.status(200).json({ success: true, data: cinema });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const cinema = await cinemaService.deleteCinema(req.params.id);
      if (!cinema) {
        return res
          .status(404)
          .json({ success: false, message: "Rạp phim không tồn tại." });
      }
      res
        .status(200)
        .json({ success: true, message: "Xóa rạp phim thành công." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const cinema = await cinemaService.updateCinemaStatus(
        req.params.id,
        status,
      );
      if (!cinema) {
        return res
          .status(404)
          .json({ success: false, message: "Rạp phim không tồn tại." });
      }
      res.status(200).json({ success: true, data: cinema });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CinemaController();
