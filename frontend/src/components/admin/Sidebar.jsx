import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NAV_ITEMS = [
  {
    label: "Tổng quan",
    path: "/admin/dashboard",
    icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  },
  {
    label: "Quản lý phim",
    path: "/admin/movies",
    icon: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z",
  },
  {
    label: "Người dùng",
    path: "/admin/users",
    icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z",
  },
  {
    label: "Phân quyền",
    path: "/admin/roles",
    icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
  },
  {
    label: "Cài đặt",
    path: "/admin/settings",
    icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const roleName =
    user?.role && typeof user.role === "object" ? user.role.name : user?.role;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
      <div className="admin-sidebar-header">
        <div className="admin-logo" onClick={() => navigate("/")}>
          CinemaHub
        </div>

        <button
          className="admin-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
      </div>

      <nav className="admin-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d={item.icon} />
            </svg>

            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-user">
        <div className="admin-sidebar-avatar">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>

        {sidebarOpen && (
          <div className="admin-sidebar-user-info">
            <div>{user?.name}</div>
            <div>{roleName}</div>
          </div>
        )}

        <button className="admin-logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
