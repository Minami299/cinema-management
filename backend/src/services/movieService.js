const Movie = require("../models/Movie");

// Lấy tất cả phim
const getAllMoviesFromDB = async () => {
  try {
    return await Movie.find();
  } catch (error) {
    throw new Error("DB error (get all movies): " + error.message);
  }
};

// Lấy phim trang chủ (mới nhất)
const getHomeMoviesFromDB = async (limit = 10) => {
  try {
    return await Movie.find().sort({ createdAt: -1 }).limit(limit);
  } catch (error) {
    throw new Error("DB error (home movies): " + error.message);
  }
};

// Lấy chi tiết phim theo ID
const getMovieByIdFromDB = async (id) => {
  try {
    return await Movie.findById(id);
  } catch (error) {
    throw new Error("DB error (movie by id): " + error.message);
  }
};

module.exports = {
  getAllMoviesFromDB,
  getHomeMoviesFromDB,
  getMovieByIdFromDB,
};
