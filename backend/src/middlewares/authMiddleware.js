const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  const token = authHeader.split(" ")[1];
  try {
    // Chỉ giải mã token, không truy vấn Database ở đây
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // req.user lúc này sẽ có { id, role, iat, exp }
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

module.exports = authMiddleware;
