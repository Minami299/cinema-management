import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./ManagerDashboard.css";

const NAV_ITEMS = [
  {
    key: "overview",
    label: "Tổng quan",
    icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  },
  {
    key: "movies",
    label: "Quản lý phim",
    icon: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z",
  },
  {
    key: "showtimes",
    label: "Suất chiếu",
    icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
  },
  {
    key: "cinemas",
    label: "Rạp & Phòng",
    icon: "M12 3L2 12h3v9h6v-5h2v5h6v-9h3L12 3zm0 12.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
  },
];

const STATS = [
  {
    label: "Phim đang chiếu",
    value: "24",
    change: "+3",
    color: "#e50914",
    icon: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z",
  },
  {
    label: "Suất chiếu hôm nay",
    value: "86",
    change: "+12",
    color: "#7c3aed",
    icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
  },
  {
    label: "Số rạp",
    value: "5",
    change: "0",
    color: "#2563eb",
    icon: "M12 3L2 12h3v9h6v-5h2v5h6v-9h3L12 3z",
  },
  {
    label: "Doanh thu tuần",
    value: "₫48M",
    change: "+7%",
    color: "#10b981",
    icon: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
  },
];

const UPCOMING_SHOWTIMES = [
  {
    movie: "Avengers: Doomsday",
    cinema: "CinemaHub Q1",
    room: "Phòng 1",
    time: "09:00",
    seats: "120/150",
    status: "open",
  },
  {
    movie: "Mission: Impossible 8",
    cinema: "CinemaHub Q7",
    room: "Phòng 3",
    time: "11:30",
    seats: "98/120",
    status: "open",
  },
  {
    movie: "The Batman Returns",
    cinema: "CinemaHub Thủ Đức",
    room: "Phòng IMAX",
    time: "14:00",
    seats: "200/200",
    status: "full",
  },
  {
    movie: "Spider-Man: New World",
    cinema: "CinemaHub Q1",
    room: "Phòng 2",
    time: "16:15",
    seats: "45/150",
    status: "open",
  },
];

const ManagerDashboard = () => {
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
    <div className="manager-root">
      {/* SIDEBAR */}
      <aside
        className={`manager-sidebar ${sidebarOpen ? "open" : "collapsed"}`}
      >
        <div className="manager-sidebar-header">
          <div className="manager-logo" onClick={() => navigate("/")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2-2 0-2-.9-2-2zm-9 4H5v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8h6v8zm8 0h-6V8h6v8z" />
            </svg>
            {sidebarOpen && <span>CinemaHub</span>}
          </div>
          <button
            className="manager-sidebar-toggle"
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

        <nav className="manager-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`manager-nav-item ${activeNav === item.key ? "active" : ""}`}
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

        <div className="manager-sidebar-user">
          <div className="manager-sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "M"}
          </div>
          {sidebarOpen && (
            <div className="manager-sidebar-user-info">
              <div className="manager-sidebar-user-name">
                {user?.name || "Manager"}
              </div>
              <div className="manager-sidebar-user-role">{roleName}</div>
            </div>
          )}
          <button
            className="manager-logout-btn"
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
      <main className="manager-main">
        <header className="manager-topbar">
          <div>
            <h1 className="manager-page-title">
              {activeNav === "overview" && "Tổng quan quản lý"}
              {activeNav === "movies" && "Quản lý phim"}
              {activeNav === "showtimes" && "Quản lý suất chiếu"}
              {activeNav === "cinemas" && "Quản lý rạp & phòng"}
            </h1>
            <p className="manager-page-subtitle">
              Xin chào, <strong>{user?.name}</strong>. Vai trò:{" "}
              <span className="manager-role-badge">{roleName}</span>
            </p>
          </div>
          <button className="manager-topbar-btn" onClick={() => navigate("/")}>
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
        </header>

        {/* OVERVIEW */}
        {activeNav === "overview" && (
          <div className="manager-content">
            <div className="manager-stats-grid">
              {STATS.map((s, i) => (
                <div className="manager-stat-card" key={i}>
                  <div
                    className="manager-stat-icon"
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
                  <div className="manager-stat-info">
                    <div className="manager-stat-value">{s.value}</div>
                    <div className="manager-stat-label">{s.label}</div>
                  </div>
                  <div className="manager-stat-change positive">{s.change}</div>
                </div>
              ))}
            </div>

            <div className="manager-section-title">Suất chiếu hôm nay</div>
            <div className="manager-table-wrap">
              <table className="manager-table">
                <thead>
                  <tr>
                    <th>Phim</th>
                    <th>Rạp</th>
                    <th>Phòng</th>
                    <th>Giờ chiếu</th>
                    <th>Ghế</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {UPCOMING_SHOWTIMES.map((s, i) => (
                    <tr key={i}>
                      <td style={{ color: "#e0e0f8", fontWeight: 500 }}>
                        {s.movie}
                      </td>
                      <td style={{ color: "#8888aa" }}>{s.cinema}</td>
                      <td style={{ color: "#8888aa" }}>{s.room}</td>
                      <td>
                        <span className="manager-time-badge">{s.time}</span>
                      </td>
                      <td style={{ color: "#c0c0e0" }}>{s.seats}</td>
                      <td>
                        <span className={`manager-table-status ${s.status}`}>
                          {s.status === "open" ? "Mở bán" : "Hết chỗ"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MOVIES */}
        {activeNav === "movies" && (
          <div className="manager-content">
            <div className="manager-placeholder-panel">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#e50914", marginBottom: 16 }}
              >
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="2" y1="7" x2="7" y2="7" />
                <line x1="2" y1="17" x2="7" y2="17" />
                <line x1="17" y1="17" x2="22" y2="17" />
                <line x1="17" y1="7" x2="22" y2="7" />
              </svg>
              <div className="manager-placeholder-title">Quản lý phim</div>
              <div className="manager-placeholder-desc">
                Thêm, sửa, xóa và quản lý danh sách phim đang chiếu và sắp
                chiếu.
              </div>
            </div>
          </div>
        )}

        {/* SHOWTIMES */}
        {activeNav === "showtimes" && (
          <div className="manager-content">
            <div className="manager-placeholder-panel">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#7c3aed", marginBottom: 16 }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div className="manager-placeholder-title">
                Quản lý suất chiếu
              </div>
              <div className="manager-placeholder-desc">
                Lên lịch và quản lý suất chiếu cho từng phòng và rạp.
              </div>
            </div>
          </div>
        )}

        {/* CINEMAS */}
        {activeNav === "cinemas" && (
          <div className="manager-content">
            <div className="manager-placeholder-panel">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#2563eb", marginBottom: 16 }}
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <div className="manager-placeholder-title">
                Quản lý rạp & phòng
              </div>
              <div className="manager-placeholder-desc">
                Thêm và cấu hình rạp chiếu phim, phòng chiếu và sơ đồ ghế.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;
