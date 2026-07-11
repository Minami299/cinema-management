const movieService = require("../services/movieService");

const handleGetAllMovies = async (req, res) => {
  try {
    const movies = await movieService.getAllMoviesFromDB();
    return res
      .status(200)
      .json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getHomeMovies = async (req, res) => {
  try {
    const movies = await movieService.getHomeMoviesFromDB(
      parseInt(req.query.limit) || 10,
    );
    return res.status(200).json({ success: true, data: movies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const handleGetMovieById = async (req, res) => {
  try {
    const movie = await movieService.getMovieByIdFromDB(req.params.id);
    if (!movie)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phim" });
    return res.status(200).json({ success: true, data: movie });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const handleCreateMovie = async (req, res) => {
  try {
    const newMovie = await movieService.createMovieInDB(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Thêm phim thành công", data: newMovie });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const handleUpdateMovie = async (req, res) => {
  try {
    const updatedMovie = await movieService.updateMovieInDB(
      req.params.id,
      req.body,
    );
    if (!updatedMovie)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phim" });
    return res.status(200).json({ success: true, data: updatedMovie });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const handleDeleteMovie = async (req, res) => {
  try {
    const deletedMovie = await movieService.deleteMovieFromDB(req.params.id);
    if (!deletedMovie)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phim" });
    return res
      .status(200)
      .json({ success: true, message: "Xóa phim thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleGetAllMovies,
  getHomeMovies,
  handleGetMovieById,
  handleCreateMovie,
  handleUpdateMovie,
  handleDeleteMovie,
};
