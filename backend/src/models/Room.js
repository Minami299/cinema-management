const mongoose = require("mongoose");

// Định nghĩa cấu trúc ghế vật lý cố định trong phòng
const SeatLayoutSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true }, // Ví dụ: "A1", "A2"
    row: { type: String, required: true }, // Ví dụ: "A", "B"
    type: {
      type: String,
      enum: ["Standard", "VIP", "Sweetbox"],
      default: "Standard",
    },
  },
  { _id: false },
);

const RoomSchema = new mongoose.Schema(
  {
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },
    name: { type: String, required: true }, // Ví dụ: "Phòng chiếu 01"
    type: { type: String, enum: ["2D", "3D", "IMAX"], default: "2D" },
    seats: [SeatLayoutSchema], // NHÚNG sơ đồ ghế cố định vào đây để tránh JOIN
  },
  { timestamps: true },
);

module.exports = mongoose.model("Room", RoomSchema);
