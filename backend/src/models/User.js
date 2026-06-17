const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Mật khẩu đã mã hóa (bcrypt)
    fullName: { type: String, required: true },
    phone: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }, // Tham chiếu Roles
    isActive: { type: Boolean, default: true },
    pictureProfile: { type: String }, // URL ảnh hồ sơ cá nhân
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }], // Nhúng trực tiếp mảng phim yêu thích
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
