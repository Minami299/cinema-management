const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    synopsis: { type: String }, // Tóm tắt nội dung phim
    genre: [{ type: String }], // Mảng thể loại phim
    duration: { type: Number, required: true }, // Thời lượng phim (phút)
    cast: [{ type: String }], // Danh sách diễn viên
    trailerUrl: { type: String },
    rating: { type: Number, default: 0 },
    releaseDate: { type: Date },
    status: {
      type: String,
      enum: ["Now Showing", "Coming Soon", "End of Showing"],
      default: "Coming Soon",
    },
    posterUrl: { type: String },
  },
  { timestamps: true },
);

// Đánh Index để tối ưu tìm kiếm và lọc phim (UC-04, UC-28)
MovieSchema.index({ title: "text", synopsis: "text" });
MovieSchema.index({ status: 1, releaseDate: -1 });

module.exports = mongoose.model("Movie", MovieSchema);
