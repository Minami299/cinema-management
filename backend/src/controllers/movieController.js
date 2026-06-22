const movieService = require("../services/movieService");

// GET ALL
const handleGetAllMovies = async (req, res) => {
  try {
    const movies = await movieService.getAllMoviesFromDB();

    return res.status(200).json({
      success: true,
      message: "Lấy tất cả phim thành công",
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// HOME MOVIES
const getHomeMovies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const movies = await movieService.getHomeMoviesFromDB(limit);

    return res.status(200).json({
      success: true,
      message: "Lấy phim trang chủ thành công",
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BY ID (FIX 404)
const handleGetMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await movieService.getMovieByIdFromDB(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phim",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy chi tiết phim thành công",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  handleGetAllMovies,
  getHomeMovies,
  handleGetMovieById,
};
