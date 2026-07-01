import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Guard theo role. Nếu user chưa đăng nhập -> /login.
 * Nếu đã đăng nhập nhưng không đủ role -> /unauthorized.
 * allowedRoles: mảng các tên role được phép, ví dụ ["ADMIN", "MANAGER"]
 */
const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0a0a0f",
          color: "#a0a0b0",
          fontSize: "16px",
        }}
      >
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRoleName =
    user.role && typeof user.role === "object" ? user.role.name : user.role;

  if (allowedRoles && !allowedRoles.includes(userRoleName)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
