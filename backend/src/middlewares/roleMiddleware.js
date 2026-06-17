const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const userRole = req.user.role?.toString();
    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền truy cập." });
    }

    next();
  };
};

module.exports = authorizeRoles;
