const mongoose = require("mongoose");

// Cấu trúc trạng thái ghế động cho từng suất chiếu cụ thể
const ShowtimeSeatStatusSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["Available", "Locked", "Booked"],
    default: "Available",
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }, // User đang giữ ghế tạm thời
  lockedAt: { type: Date, default: null }, // Thời gian khóa ghế để phục vụ auto-release sau 5-10 phút
});

const ShowtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    date: { type: Date, required: true }, // Ngày chiếu (YYYY-MM-DD)
    startTime: { type: String, required: true }, // Giờ bắt đầu, ví dụ: "14:30"
    endTime: { type: String, required: true }, // Giờ kết thúc, ví dụ: "16:45"
    ticketPrice: { type: Number, required: true }, // Giá vé cơ bản cho suất chiếu này
    seatStatus: [ShowtimeSeatStatusSchema], // Mảng động cập nhật trạng thái ghế theo thời gian thực
  },
  { timestamps: true },
);

module.exports = mongoose.model("Showtime", ShowtimeSchema);
