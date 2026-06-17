const Movie = require("../models/Movie");

// Logic lấy toàn bộ danh sách phim từ Database
const getAllMoviesFromDB = async () => {
  // Sắp xếp phim mới nhất lên đầu dựa vào thuộc tính timestamps (createdAt: -1)
  return await Movie.find().sort({ createdAt: -1 });
};

module.exports = {
  getAllMoviesFromDB,
};
