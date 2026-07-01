import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * DashboardPage: tự động redirect đến trang dashboard phù hợp theo role.
 * - ADMIN    -> /admin/dashboard
 * - MANAGER  -> /manager/dashboard
 * - STAFF    -> /staff/dashboard
 * - CUSTOMER -> /profile
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const roleName = String(
      user.role && typeof user.role === "object"
        ? user.role.name
        : user.role || "",
    ).toUpperCase();

    switch (roleName) {
      case "ADMIN":
        navigate("/admin/dashboard", { replace: true });
        break;
      case "MANAGER":
        navigate("/manager/dashboard", { replace: true });
        break;
      case "STAFF":
        navigate("/staff/dashboard", { replace: true });
        break;
      case "CUSTOMER":
      default:
        navigate("/profile", { replace: true });
        break;
    }
  }, [user, loading, navigate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0a0a0f",
        color: "#6666aa",
        fontSize: "16px",
      }}
    >
      Đang chuyển hướng...
    </div>
  );
};

export default DashboardPage;
