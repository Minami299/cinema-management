const mongoose = require("mongoose");

// Cấu trúc trạng thái ghế động cho từng suất chiếu
const SeatStatusSchema = new mongoose.Schema(
  {
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
    lockedAt: { type: Date, default: null }, // Thời gian giữ ghế phục vụ tác vụ tự động giải phóng (sau 5-10 phút)
  },
  { _id: false },
);

const ShowtimeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true }, // Giá vé cơ sở của suất chiếu
    seatStatus: [SeatStatusSchema], // Mảng trạng thái động phục vụ Real-time và tránh trùng ghế
  },
  { timestamps: true },
);

// Tối ưu tốc độ hiển thị lịch chiếu theo rạp và phim
ShowtimeSchema.index({ cinemaId: 1, movieId: 1, startTime: 1 });

module.exports = mongoose.model("Showtime", ShowtimeSchema);
