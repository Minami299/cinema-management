const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const userRole = req.user.role?.toString();
    const roleMap = {
      "65f1a2b3c4d5e6f7a8b90101": "ADMIN",
      "65f1a2b3c4d5e6f7a8b90102": "MANAGER",
    };

    const currentRoleName = roleMap[userRole] || userRole;

    if (!allowedRoles.includes(currentRoleName)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Bạn không có quyền truy cập tính năng này.",
        });
    }
    next();
  };
};

module.exports = authorizeRoles;
