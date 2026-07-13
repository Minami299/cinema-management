const Movie = require("../models/Movie");

class MovieService {
  async getAllMoviesFromDB() {
    return await Movie.find().sort({ createdAt: -1 });
  }

  async getHomeMoviesFromDB(limit) {
    return await Movie.find().limit(limit).sort({ createdAt: -1 });
  }

  async getMovieByIdFromDB(id) {
    return await Movie.findById(id);
  }

  async createMovieInDB(movieData) {
    const movie = new Movie(movieData);
    return await movie.save();
  }

  async updateMovieInDB(id, movieData) {
    return await Movie.findByIdAndUpdate(
      id,
      { $set: movieData },
      { new: true, runValidators: true },
    );
  }

  async deleteMovieFromDB(id) {
    return await Movie.findByIdAndDelete(id);
  }
}

module.exports = new MovieService();
