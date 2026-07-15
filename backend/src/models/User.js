const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      ref: "Role",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    // Nhúng trực tiếp mảng các bộ phim yêu thích để tăng tốc độ truy vấn
    favorites: [{ type: String, ref: "Movie" }],
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
