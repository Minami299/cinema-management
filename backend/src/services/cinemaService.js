const Cinema = require("../models/Cinema");

class CinemaService {
  async createCinema(cinemaData) {
    try {
      const newCinema = new Cinema(cinemaData);
      return await newCinema.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Tên rạp phim đã tồn tại.");
      }
      throw error;
    }
  }

  async getAllCinemas() {
    return await Cinema.find().sort({ createdAt: -1 });
  }

  async getCinemaById(id) {
    return await Cinema.findById(id);
  }

  async getCinemasByCity(city) {
    return await Cinema.find({ city }).sort({ name: 1 });
  }

  async updateCinema(id, updateData) {
    return await Cinema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteCinema(id) {
    return await Cinema.findByIdAndDelete(id);
  }

  async updateCinemaStatus(id, status) {
    return await Cinema.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
  }
}

module.exports = new CinemaService();
