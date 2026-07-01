const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Cấu hình cookie dùng chung để tránh lặp code (DRY)
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // Đặt false để hỗ trợ HTTP localhost (tránh lỗi bảo mật cookie trên HTTP)
  sameSite: "lax", // Đổi thành lax để cookie có thể gửi cross-port trên localhost
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
};

const generateAccessToken = (user) => {
  const roleName =
    user.role && typeof user.role === "object" ? user.role.name : user.role;
  return jwt.sign(
    { id: user._id, role: roleName },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (user) => {
  const roleName =
    user.role && typeof user.role === "object" ? user.role.name : user.role;
  return jwt.sign(
    { id: user._id, role: roleName },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
};

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, phone, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp name, email và password.",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(409)
          .json({ success: false, message: "Email đã tồn tại." });
      }

      let roleId = role;
      if (!roleId) {
        let defaultRole = await Role.findOne({ name: "CUSTOMER" });
        if (!defaultRole) {
          defaultRole = await Role.create({
            name: "CUSTOMER",
            description: "Vai trò khách hàng mặc định",
            permissions: [],
          });
        }
        roleId = defaultRole._id;
      }

      console.log("Bắt đầu đăng ký user:", { name, email, phone, roleId });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        role: roleId,
      });
      const savedUser = await newUser.save();
      console.log("Đã lưu user vào DB thành công:", savedUser);

      // Ánh xạ role ngay sau khi tạo để trả về đầy đủ thông tin chữ
      await newUser.populate("role");

      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);

      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

      res.status(201).json({
        success: true,
        data: {
          user: {
            _id: newUser._id,
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
          },
          accessToken,
        },
      });
    } catch (error) {
      console.error("Lỗi xảy ra khi đăng ký:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp email và password.",
        });
      }

      // Ánh xạ role để lấy tên hiển thị của phân quyền
      const user = await User.findOne({ email }).populate("role");

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Email hoặc mật khẩu không đúng." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Email hoặc mật khẩu không đúng." });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      console.log("Set RefreshToken Cookie:", refreshToken ? "Có" : "Không", COOKIE_OPTIONS);
      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

      res.status(200).json({
        success: true,
        data: {
          user: {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async logout(req, res) {
    // Khi xóa cookie, cần truyền đúng các tùy chọn cấu hình ngoại trừ maxAge
    const { maxAge, ...clearOptions } = COOKIE_OPTIONS;
    res.clearCookie("refreshToken", clearOptions);
    res.status(200).json({ success: true, message: "Đăng xuất thành công." });
  }

  async refreshToken(req, res) {
    try {
      console.log("Cookies nhận được từ client:", req.cookies);
      const token = req.cookies.refreshToken;
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Refresh token không tồn tại." });
      }

      // Giải mã đồng bộ trực tiếp trong khối try...catch
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      const user = await User.findById(decoded.id).populate("role");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Người dùng không tồn tại." });
      }

      const accessToken = generateAccessToken(user);
      res.status(200).json({
        success: true,
        data: { accessToken },
      });
    } catch (error) {
      // Bắt các lỗi cụ thể liên quan tới việc Token hết hạn hoặc bất hợp lệ
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res.status(403).json({
          success: false,
          message: "Refresh token không hợp lệ hoặc đã hết hạn.",
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMe(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized." });
      }

      // Ánh xạ role để lấy tên hiển thị của phân quyền thay vì chuỗi ID
      const user = await User.findById(req.user.id)
        .select("-password")
        .populate("role");

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Người dùng không tồn tại." });
      }

      // Trả về đầy đủ các trường, bao gồm _id và phone
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();
