import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./StaffDashboard.css";

const NAV_ITEMS = [
  {
    key: "overview",
    label: "Tổng quan",
    icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  },
  {
    key: "bookings",
    label: "Đơn đặt vé",
    icon: "M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2-2 0-2-.9-2-2zm-9 4H5v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8h6v8zm8 0h-6V8h6v8z",
  },
  {
    key: "food",
    label: "Đồ ăn & thức uống",
    icon: "M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2H1.02v-2z",
  },
];

const STATS = [
  {
    label: "Đơn hôm nay",
    value: "47",
    change: "+8",
    color: "#2563eb",
    icon: "M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2-2 0-2-.9-2-2zm-9 4H5v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8h6v8zm8 0h-6V8h6v8z",
  },
  {
    label: "Chờ xử lý",
    value: "12",
    change: "-3",
    color: "#f59e0b",
    icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
  },
  {
    label: "Đã hoàn thành",
    value: "35",
    change: "+11",
    color: "#10b981",
    icon: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  },
  {
    label: "Order đồ ăn",
    value: "23",
    change: "+5",
    color: "#f97316",
    icon: "M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05z",
  },
];

const RECENT_BOOKINGS = [
  {
    id: "BK001",
    customer: "Nguyen Van A",
    movie: "Avengers: Doomsday",
    seats: "A1, A2",
    time: "09:00",
    amount: "180,000₫",
    status: "confirmed",
  },
  {
    id: "BK002",
    customer: "Tran Thi B",
    movie: "Mission: Impossible 8",
    seats: "C5",
    time: "11:30",
    amount: "90,000₫",
    status: "pending",
  },
  {
    id: "BK003",
    customer: "Le Van C",
    movie: "The Batman Returns",
    seats: "B3, B4, B5",
    time: "14:00",
    amount: "270,000₫",
    status: "confirmed",
  },
  {
    id: "BK004",
    customer: "Pham Thi D",
    movie: "Spider-Man: New World",
    seats: "D7",
    time: "16:15",
    amount: "90,000₫",
    status: "cancelled",
  },
  {
    id: "BK005",
    customer: "Hoang Van E",
    movie: "Avengers: Doomsday",
    seats: "E2, E3",
    time: "19:00",
    amount: "180,000₫",
    status: "confirmed",
  },
];

const STATUS_CONFIG = {
  confirmed: { label: "Đã xác nhận", color: "#10b981" },
  pending: { label: "Chờ xử lý", color: "#f59e0b" },
  cancelled: { label: "Đã hủy", color: "#ef4444" },
};

const StaffDashboard = () => {
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
    <div className="staff-root">
      {/* SIDEBAR */}
      <aside className={`staff-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="staff-sidebar-header">
          <div className="staff-logo" onClick={() => navigate("/")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2-2 0-2-.9-2-2zm-9 4H5v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8h6v8zm8 0h-6V8h6v8z" />
            </svg>
            {sidebarOpen && <span>CinemaHub</span>}
          </div>
          <button
            className="staff-sidebar-toggle"
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

        <nav className="staff-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`staff-nav-item ${activeNav === item.key ? "active" : ""}`}
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

        <div className="staff-sidebar-user">
          <div className="staff-sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          {sidebarOpen && (
            <div className="staff-sidebar-user-info">
              <div className="staff-sidebar-user-name">
                {user?.name || "Staff"}
              </div>
              <div className="staff-sidebar-user-role">{roleName}</div>
            </div>
          )}
          <button
            className="staff-logout-btn"
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
      <main className="staff-main">
        <header className="staff-topbar">
          <div>
            <h1 className="staff-page-title">
              {activeNav === "overview" && "Tổng quan ca làm việc"}
              {activeNav === "bookings" && "Quản lý đơn đặt vé"}
              {activeNav === "food" && "Quản lý đồ ăn & thức uống"}
            </h1>
            <p className="staff-page-subtitle">
              Xin chào, <strong>{user?.name}</strong>. Vai trò:{" "}
              <span className="staff-role-badge">{roleName}</span>
            </p>
          </div>
          <button className="staff-topbar-btn" onClick={() => navigate("/")}>
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
          <div className="staff-content">
            <div className="staff-stats-grid">
              {STATS.map((s, i) => (
                <div className="staff-stat-card" key={i}>
                  <div
                    className="staff-stat-icon"
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
                  <div className="staff-stat-info">
                    <div className="staff-stat-value">{s.value}</div>
                    <div className="staff-stat-label">{s.label}</div>
                  </div>
                  <div
                    className={`staff-stat-change ${s.change.startsWith("-") ? "negative" : "positive"}`}
                  >
                    {s.change}
                  </div>
                </div>
              ))}
            </div>

            <div className="staff-section-title">Đơn đặt vé gần nhất</div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Phim</th>
                    <th>Ghế</th>
                    <th>Giờ chiếu</th>
                    <th>Tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BOOKINGS.map((b, i) => (
                    <tr key={i}>
                      <td>
                        <span className="staff-booking-id">{b.id}</span>
                      </td>
                      <td style={{ color: "#c0c0e8", fontWeight: 500 }}>
                        {b.customer}
                      </td>
                      <td style={{ color: "#8888aa" }}>{b.movie}</td>
                      <td style={{ color: "#8888aa", fontFamily: "monospace" }}>
                        {b.seats}
                      </td>
                      <td>
                        <span className="staff-time-tag">{b.time}</span>
                      </td>
                      <td style={{ color: "#10b981", fontWeight: 600 }}>
                        {b.amount}
                      </td>
                      <td>
                        <span
                          className="staff-table-status"
                          style={{
                            background: `${STATUS_CONFIG[b.status].color}15`,
                            color: STATUS_CONFIG[b.status].color,
                            border: `1px solid ${STATUS_CONFIG[b.status].color}33`,
                          }}
                        >
                          {STATUS_CONFIG[b.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeNav === "bookings" && (
          <div className="staff-content">
            <div className="staff-placeholder-panel">
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
                <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-9 4H5v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8h6v8zm8 0h-6V8h6v8z" />
              </svg>
              <div className="staff-placeholder-title">Quản lý đơn đặt vé</div>
              <div className="staff-placeholder-desc">
                Xem, xác nhận và xử lý các đơn đặt vé của khách hàng.
              </div>
            </div>
          </div>
        )}

        {/* FOOD */}
        {activeNav === "food" && (
          <div className="staff-content">
            <div className="staff-placeholder-panel">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#f97316", marginBottom: 16 }}
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
              <div className="staff-placeholder-title">
                Quản lý đồ ăn & thức uống
              </div>
              <div className="staff-placeholder-desc">
                Quản lý menu, order đồ ăn và xử lý yêu cầu của khách hàng.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;
