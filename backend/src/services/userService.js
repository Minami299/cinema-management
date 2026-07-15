const User = require("../models/User");
const bcrypt = require("bcryptjs");

class UserService {
  async createUser(userData) {
    try {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Email đã được sử dụng.");
      }
      throw error;
    }
  }

  async getUserById(id) {
    return await User.findById(id)
      .populate("role")
      // SỬA TẠI ĐÂY: Đổi "imageUrl" thành "poster"
      .populate("favorites", "title poster duration");
  }

  async getUserByEmail(email) {
    return await User.findOne({ email }).populate("role");
  }

  async updateUser(id, updateData) {
    // Không cho phép cập nhật mật khẩu qua hàm này
    delete updateData.password;

    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("role")
      .populate("favorites");
  }

  async updatePassword(id, oldPassword, newPassword) {
    const user = await User.findById(id);
    if (!user) throw new Error("Người dùng không tồn tại.");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Mật khẩu cũ không chính xác.");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    return await user.save();
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  async toggleUserStatus(id, isActive) {
    return await User.findByIdAndUpdate(
      id,
      { isActive: Boolean(isActive) },
      { new: true, runValidators: true },
    ).populate("role");
  }

  async addFavoriteMovie(userId, movieId) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: movieId } },
      { new: true },
    ).populate("favorites");
  }

  async removeFavoriteMovie(userId, movieId) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: movieId } },
      { new: true },
    ).populate("favorites");
  }

  async getFavoriteMovies(userId) {
    const user = await User.findById(userId).populate("favorites");
    return user ? user.favorites : [];
  }

  async getAllUsers() {
    return await User.find().populate("role").sort({ createdAt: -1 });
  }

  async getUsersByRole(roleId) {
    return await User.find({ role: roleId }).populate("role");
  }
}

module.exports = new UserService();
