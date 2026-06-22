const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    title: { type: String, required: true },
    synopsis: { type: String }, // Tóm tắt nội dung phim
    genre: [{ type: String }], // Mảng thể loại phim
    duration: { type: Number, required: true }, // Thời lượng phim (phút)
    director: { type: String }, // Đạo diễn
    cast: [{ type: String }], // Danh sách diễn viên
    language: { type: String, default: "Vietnamese" }, // Ngôn ngữ / Phụ đề (ví dụ: "Tiếng Anh - Phụ đề Tiếng Việt")
    ageRating: {
      type: String,
      enum: ["P", "K", "T13", "T16", "T18", "C18"],
      default: "P",
    }, // Phân loại giới hạn độ tuổi (P: Phổ biến, C18: Cấm khán giả dưới 18 tuổi...)
    trailerUrl: { type: String },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }, // Số lượng lượt đánh giá phục vụ tính trung bình rating
    releaseDate: { type: Date },
    status: {
      type: String,
      enum: ["Now Showing", "Coming Soon", "End of Showing"],
      default: "Coming Soon",
    },
    posterUrl: { type: String }, // URL ảnh poster dạng dọc (tỉ lệ 2:3) cho card phim
    bannerUrl: { type: String }, // URL ảnh poster dạng ngang (tỉ lệ 16:9) cho banner chính / Carousel
  },
  { timestamps: true },
);

// Đánh Index để tối ưu tìm kiếm và lọc phim
MovieSchema.index({ title: "text", synopsis: "text" });
MovieSchema.index({ status: 1, releaseDate: -1 });

module.exports = mongoose.model("Movie", MovieSchema);
