import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AdminDashboard.css";

const NAV_ITEMS = [
  {
    key: "overview",
    label: "Tổng quan",
    icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  },
  {
    key: "users",
    label: "Người dùng",
    icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  },
  {
    key: "roles",
    label: "Phân quyền",
    icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
  },
  {
    key: "settings",
    label: "Cài đặt hệ thống",
    icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a6.9 6.9 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  },
];

const STATS = [
  {
    label: "Tổng người dùng",
    value: "1,284",
    change: "+12%",
    icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    color: "#6366f1",
  },
  {
    label: "Doanh thu tháng",
    value: "₫182M",
    change: "+8%",
    icon: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
    color: "#10b981",
  },
  {
    label: "Đặt vé hôm nay",
    value: "348",
    change: "+5%",
    icon: "M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-9 4H5v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8h6v8zm8 0h-6V8h6v8z",
    color: "#f59e0b",
  },
  {
    label: "Phim đang chiếu",
    value: "24",
    change: "+3",
    icon: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z",
    color: "#e50914",
  },
];

const RECENT_USERS = [
  {
    name: "Nguyen Van A",
    email: "nva@gmail.com",
    role: "CUSTOMER",
    status: "active",
  },
  {
    name: "Tran Thi B",
    email: "ttb@gmail.com",
    role: "STAFF",
    status: "active",
  },
  {
    name: "Le Van C",
    email: "lvc@gmail.com",
    role: "MANAGER",
    status: "inactive",
  },
  {
    name: "Pham Thi D",
    email: "ptd@gmail.com",
    role: "CUSTOMER",
    status: "active",
  },
  {
    name: "Hoang Van E",
    email: "hve@gmail.com",
    role: "CUSTOMER",
    status: "active",
  },
];

const ROLE_COLORS = {
  ADMIN: "#dc2626",
  MANAGER: "#7c3aed",
  STAFF: "#2563eb",
  CUSTOMER: "#059669",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const roleName =
    user?.role && typeof user.role === "object" ? user.role.name : user?.role;

  return (
    <div className="admin-root">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo" onClick={() => navigate("/")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2-2 0-2-.9-2-2zm-9 4H5v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8h6v8zm8 0h-6V8h6v8z" />
            </svg>
            {sidebarOpen && <span>CinemaHub</span>}
          </div>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item ${activeNav === item.key ? "active" : ""}`}
              onClick={() => setActiveNav(item.key)}
              title={item.label}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d={item.icon} />
              </svg>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          {sidebarOpen && (
            <div className="admin-sidebar-user-info">
              <div className="admin-sidebar-user-name">
                {user?.name || "Admin"}
              </div>
              <div className="admin-sidebar-user-role">{roleName}</div>
            </div>
          )}
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1 className="admin-page-title">
              {activeNav === "overview" && "Tổng quan hệ thống"}
              {activeNav === "users" && "Quản lý người dùng"}
              {activeNav === "roles" && "Quản lý phân quyền"}
              {activeNav === "settings" && "Cài đặt hệ thống"}
            </h1>
            <p className="admin-page-subtitle">
              Xin chào, <strong>{user?.name}</strong>. Vai trò:{" "}
              <span className="admin-role-badge">{roleName}</span>
            </p>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-topbar-btn" onClick={() => navigate("/")}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Trang chủ
            </button>
          </div>
        </header>

        {/* OVERVIEW */}
        {activeNav === "overview" && (
          <div className="admin-content">
            <div className="admin-stats-grid">
              {STATS.map((s, i) => (
                <div className="admin-stat-card" key={i}>
                  <div
                    className="admin-stat-icon"
                    style={{ background: `${s.color}22`, color: s.color }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={s.icon} />
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <div className="admin-stat-value">{s.value}</div>
                    <div className="admin-stat-label">{s.label}</div>
                  </div>
                  <div className="admin-stat-change positive">{s.change}</div>
                </div>
              ))}
            </div>

            <div className="admin-section-title">Người dùng mới nhất</div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_USERS.map((u, i) => (
                    <tr key={i}>
                      <td>
                        <div className="admin-table-user">
                          <div className="admin-table-avatar">
                            {u.name.charAt(0)}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td style={{ color: "#8888aa" }}>{u.email}</td>
                      <td>
                        <span
                          className="admin-table-role-tag"
                          style={{
                            background: `${ROLE_COLORS[u.role]}22`,
                            color: ROLE_COLORS[u.role],
                            border: `1px solid ${ROLE_COLORS[u.role]}44`,
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-table-status ${u.status}`}>
                          {u.status === "active"
                            ? "Hoạt động"
                            : "Không hoạt động"}
                        </span>
                      </td>
                      <td>
                        <button className="admin-table-action-btn">Xem</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeNav === "users" && (
          <div className="admin-content">
            <div className="admin-placeholder-panel">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#6366f1", marginBottom: 16 }}
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <div className="admin-placeholder-title">Quản lý người dùng</div>
              <div className="admin-placeholder-desc">
                Chức năng quản lý CRUD người dùng sẽ được tích hợp API ở đây.
              </div>
            </div>
          </div>
        )}

        {/* ROLES */}
        {activeNav === "roles" && (
          <div className="admin-content">
            <div className="admin-roles-grid">
              {["ADMIN", "MANAGER", "STAFF", "CUSTOMER"].map((role) => (
                <div
                  className="admin-role-card"
                  key={role}
                  style={{ borderColor: `${ROLE_COLORS[role]}44` }}
                >
                  <div
                    className="admin-role-card-icon"
                    style={{
                      background: `${ROLE_COLORS[role]}22`,
                      color: ROLE_COLORS[role],
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    </svg>
                  </div>
                  <div className="admin-role-card-name">{role}</div>
                  <div className="admin-role-card-desc">
                    {role === "ADMIN" && "Toàn quyền quản trị hệ thống"}
                    {role === "MANAGER" && "Quản lý phim, rạp, suất chiếu"}
                    {role === "STAFF" && "Hỗ trợ đặt vé và đồ ăn"}
                    {role === "CUSTOMER" && "Khách hàng đặt vé và xem phim"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeNav === "settings" && (
          <div className="admin-content">
            <div className="admin-placeholder-panel">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#f59e0b", marginBottom: 16 }}
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
              <div className="admin-placeholder-title">Cài đặt hệ thống</div>
              <div className="admin-placeholder-desc">
                Cấu hình hệ thống, thông số bảo mật và tùy chỉnh nền tảng.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
