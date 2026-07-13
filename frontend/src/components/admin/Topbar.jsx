import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PAGE_TITLES = {
  "/admin/dashboard": "Tổng quan hệ thống",
  "/admin/movies": "Quản lý phim",
  "/admin/users": "Người dùng",
  "/admin/roles": "Phân quyền",
  "/admin/settings": "Cài đặt",
};

const Topbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const roleName =
    user?.role && typeof user.role === "object" ? user.role.name : user?.role;

  const pageTitle = PAGE_TITLES[location.pathname] || "Quản trị";

  return (
    <header className="admin-topbar">
      <div>
        <h1 className="admin-page-title">{pageTitle}</h1>

        <p className="admin-page-subtitle">
          Xin chào <strong>{user?.name}</strong>. Vai trò{" "}
          <span className="admin-role-badge">{roleName}</span>
        </p>
      </div>
    </header>
  );
};

export default Topbar;
