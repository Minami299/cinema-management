const mongoose = require("mongoose");

// Định nghĩa cấu trúc ghế cố định nhúng trực tiếp vào Room
const SeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true }, // Ví dụ: A1, A2, B5
  type: {
    type: String,
    enum: ["Standard", "VIP", "Sweetbox"],
    default: "Standard",
  },
  row: { type: String, required: true }, // A, B, C...
  col: { type: Number, required: true }, // 1, 2, 3...
});

const RoomSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true }, // Phòng 1, Phòng 2, IMAX Room...
    cinema: {
      type: String,
      ref: "Cinema",
      required: true,
    },
    type: { type: String, enum: ["2D", "3D", "4XD", "IMAX"], default: "2D" },
    totalSeats: { type: Number, required: true },
    seats: [SeatSchema], // Gộp danh sách ghế cố định trực tiếp vào phòng chiếu
  },
  { timestamps: true },
);

// Tạo chỉ mục kết hợp để đảm bảo trong một rạp không bị trùng tên phòng
RoomSchema.index({ cinema: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Room", RoomSchema);
