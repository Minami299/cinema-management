const movieService = require("../services/movieService");

// Xử lý API lấy danh sách phim
const handleGetAllMovies = async (req, res) => {
  try {
    const movies = await movieService.getAllMoviesFromDB();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách phim thành công!",
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi lấy danh sách phim",
      error: error.message,
    });
  }
};

module.exports = {
  handleGetAllMovies,
};
