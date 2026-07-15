const userService = require("../services/userService");

class UserController {
  async create(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getByEmail(req, res) {
    try {
      const user = await userService.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updatePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      await userService.updatePassword(req.params.id, oldPassword, newPassword);
      res.status(200).json({ success: true, message: "Cập nhật mật khẩu thành công." });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async toggleStatus(req, res) {
    try {
      const { isActive } = req.body;
      const user = await userService.toggleUserStatus(req.params.id, isActive);
      if (!user) {
        return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const user = await userService.deleteUser(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
      }
      res.status(200).json({ success: true, message: "Xóa người dùng thành công." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addFavorite(req, res) {
    try {
      const user = await userService.addFavoriteMovie(req.params.id, req.body.movieId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async removeFavorite(req, res) {
    try {
      const user = await userService.removeFavoriteMovie(req.params.id, req.body.movieId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getFavorites(req, res) {
    try {
      const favorites = await userService.getFavoriteMovies(req.params.id);
      res.status(200).json({ success: true, data: favorites });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UserController();