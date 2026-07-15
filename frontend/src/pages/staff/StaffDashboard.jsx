import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  createFoodItem,
  deleteFoodItem,
  getBookings,
  getFoodItems,
  toggleFoodAvailability,
  updateBookingStatus,
  updateFoodItem,
} from "../../services/staffService";
import "./StaffDashboard.css";

const NAV_ITEMS = [
  { key: "overview", label: "Tổng quan", icon: "▦" },
  { key: "bookings", label: "Danh sách vé", icon: "🎟" },
  { key: "food", label: "Đồ ăn & thức uống", icon: "🍿" },
];

const emptyFood = { name: "", description: "", price: "", type: "Food", imageUrl: "", isAvailable: true };
const statusText = { Pending: "Chờ xác nhận", Confirmed: "Đã xác nhận", Cancelled: "Đã hủy" };
const formatCurrency = (value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value || 0);
const formatDate = (date) => date ? new Date(date).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "—";

export default function StaffDashboard({ initialTab = "overview" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState("All");
  const [foodFilter, setFoodFilter] = useState("All");
  const [foodForm, setFoodForm] = useState(emptyFood);
  const [editingFood, setEditingFood] = useState(null);

  const roleName = user?.role && typeof user.role === "object" ? user.role.name : user?.role;
  const notify = (text) => { setMessage(text); window.setTimeout(() => setMessage(""), 3500); };
  const loadBookings = async () => {
    setLoading(true);
    try { setBookings((await getBookings()).data.data || []); }
    catch (error) { notify(error.response?.data?.message || "Không thể tải danh sách vé."); }
    finally { setLoading(false); }
  };
  const loadFoods = async () => {
    setLoading(true);
    try { setFoods((await getFoodItems()).data.data || []); }
    catch (error) { notify(error.response?.data?.message || "Không thể tải menu."); }
    finally { setLoading(false); }
  };

  const changeNav = (nextNav) => {
    setActiveNav(nextNav);
    const paths = {
      overview: "/staff/dashboard",
      bookings: "/staff/tickets",
      food: "/staff/food",
    };
    navigate(paths[nextNav]);
  };

  // Tải dữ liệu khi mở trực tiếp trang vé hoặc F&B.
  useEffect(() => {
    if (initialTab === "bookings") loadBookings();
    if (initialTab === "food") loadFoods();
  }, []);

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || booking._id?.toLowerCase().includes(query) || booking.user?.name?.toLowerCase().includes(query) || booking.showtime?.movie?.title?.toLowerCase().includes(query);
    return matchesSearch && (bookingFilter === "All" || booking.status === bookingFilter);
  }), [bookings, search, bookingFilter]);
  const filteredFoods = useMemo(() => foods.filter((food) => foodFilter === "All" || food.type === foodFilter), [foods, foodFilter]);

  const confirmBooking = async (id) => {
    try {
      await updateBookingStatus(id, "Confirmed");
      setBookings((current) => current.map((item) => item._id === id ? { ...item, status: "Confirmed", payment: { ...item.payment, status: "Completed" } } : item));
      notify("Đã xác nhận vé thành công.");
    } catch (error) { notify(error.response?.data?.message || "Không thể xác nhận vé."); }
  };
  const submitFood = async (event) => {
    event.preventDefault();
    const data = { ...foodForm, price: Number(foodForm.price) };
    try {
      if (editingFood) {
        const response = await updateFoodItem(editingFood, data);
        setFoods((current) => current.map((food) => food._id === editingFood ? response.data.data : food));
        notify("Đã cập nhật món.");
      } else {
        const response = await createFoodItem(data);
        setFoods((current) => [...current, response.data.data].sort((a, b) => a.name.localeCompare(b.name)));
        notify("Đã thêm món mới.");
      }
      setFoodForm(emptyFood); setEditingFood(null);
    } catch (error) { notify(error.response?.data?.message || "Không thể lưu món."); }
  };
  const editFood = (food) => { setEditingFood(food._id); setFoodForm({ name: food.name, description: food.description || "", price: food.price, type: food.type, imageUrl: food.imageUrl || "", isAvailable: food.isAvailable }); };
  const changeAvailability = async (food) => {
    try { const response = await toggleFoodAvailability(food._id); setFoods((current) => current.map((item) => item._id === food._id ? response.data.data : item)); }
    catch (error) { notify(error.response?.data?.message || "Không thể cập nhật trạng thái món."); }
  };
  const removeFood = async (food) => {
    if (!window.confirm(`Xóa món “${food.name}”?`)) return;
    try { await deleteFoodItem(food._id); setFoods((current) => current.filter((item) => item._id !== food._id)); notify("Đã xóa món."); }
    catch (error) { notify(error.response?.data?.message || "Không thể xóa món."); }
  };
  const handleLogout = async () => { await logout(); navigate("/login"); };

  const pendingCount = bookings.filter((item) => item.status === "Pending").length;
  return <div className="staff-root">
    <aside className={`staff-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
      <div className="staff-sidebar-header"><div className="staff-logo" onClick={() => navigate("/")}>🎬 {sidebarOpen && <span>CinemaHub</span>}</div><button className="staff-sidebar-toggle" onClick={() => setSidebarOpen((value) => !value)}>☰</button></div>
      <nav className="staff-nav">{NAV_ITEMS.map((item) => <button key={item.key} className={`staff-nav-item ${activeNav === item.key ? "active" : ""}`} onClick={() => changeNav(item.key)} title={item.label}><span className="staff-nav-icon">{item.icon}</span>{sidebarOpen && <span>{item.label}</span>}</button>)}</nav>
      <div className="staff-sidebar-user"><div className="staff-sidebar-avatar">{user?.name?.charAt(0)?.toUpperCase() || "S"}</div>{sidebarOpen && <div className="staff-sidebar-user-info"><div className="staff-sidebar-user-name">{user?.name || "Staff"}</div><div className="staff-sidebar-user-role">{roleName}</div></div>}<button className="staff-logout-btn" onClick={handleLogout} title="Đăng xuất">↪</button></div>
    </aside>
    <main className="staff-main">
      <header className="staff-topbar"><div><h1 className="staff-page-title">{activeNav === "overview" ? "Tổng quan ca làm việc" : activeNav === "bookings" ? "Danh sách vé đã đặt" : "Đồ ăn & thức uống"}</h1><p className="staff-page-subtitle">Xin chào, <strong>{user?.name}</strong>. Vai trò: <span className="staff-role-badge">{roleName}</span></p></div><button className="staff-topbar-btn" onClick={() => navigate("/")}>⌂ Trang chủ</button></header>
      {message && <div className="staff-toast">{message}</div>}
      {activeNav === "overview" && <div className="staff-content"><div className="staff-stats-grid"><Stat value={bookings.length} label="Tổng đơn vé" color="#2563eb"/><Stat value={pendingCount} label="Chờ xác nhận" color="#f59e0b"/><Stat value={bookings.filter((item) => item.status === "Confirmed").length} label="Đã xác nhận" color="#10b981"/><Stat value={foods.filter((item) => item.isAvailable).length} label="Món đang bán" color="#f97316"/></div><div className="staff-placeholder-panel"><div className="staff-placeholder-title">Sẵn sàng phục vụ</div><div className="staff-placeholder-desc">Mở “Danh sách vé” để xác nhận vé hoặc “Đồ ăn & thức uống” để quản lý menu.</div></div></div>}
      {activeNav === "bookings" && <div className="staff-content"><div className="staff-toolbar"><input className="staff-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm mã vé, khách hàng, phim..."/><select value={bookingFilter} onChange={(event) => setBookingFilter(event.target.value)}><option value="All">Tất cả trạng thái</option><option value="Pending">Chờ xác nhận</option><option value="Confirmed">Đã xác nhận</option><option value="Cancelled">Đã hủy</option></select><button className="staff-topbar-btn" onClick={loadBookings}>↻ Làm mới</button></div><div className="staff-table-wrap"><table className="staff-table booking-table"><thead><tr><th>Mã vé</th><th>Khách hàng</th><th>Phim / suất chiếu</th><th>Ghế</th><th>Tổng tiền</th><th>Trạng thái</th><th></th></tr></thead><tbody>{filteredBookings.map((booking) => <tr key={booking._id}><td><span className="staff-booking-id">{booking._id.slice(-8).toUpperCase()}</span><small>{formatDate(booking.createdAt)}</small></td><td><strong>{booking.user?.name || "—"}</strong><small>{booking.user?.phone || booking.user?.email || ""}</small></td><td>{booking.showtime?.movie?.title || "Suất chiếu đã xóa"}<small>{booking.showtime ? `${booking.showtime.startTime} · ${booking.showtime.room?.name || ""}` : ""}</small></td><td className="staff-seats">{booking.tickets?.map((ticket) => ticket.seatNumber).join(", ") || "—"}</td><td className="staff-money">{formatCurrency(booking.totalAmount)}</td><td><span className={`staff-table-status ${booking.status.toLowerCase()}`}>{statusText[booking.status]}</span></td><td>{booking.status === "Pending" && <button className="staff-action-btn confirm" onClick={() => confirmBooking(booking._id)}>Xác nhận</button>}</td></tr>)}{!loading && !filteredBookings.length && <tr><td colSpan="7" className="staff-empty">Không tìm thấy đơn vé phù hợp.</td></tr>}</tbody></table>{loading && <div className="staff-loading">Đang tải dữ liệu…</div>}</div></div>}
      {activeNav === "food" && <div className="staff-content"><div className="staff-food-layout"><section className="staff-menu-section"><div className="staff-toolbar"><div className="staff-section-title">Menu hiện có</div><select value={foodFilter} onChange={(event) => setFoodFilter(event.target.value)}><option value="All">Tất cả</option><option value="Food">Đồ ăn</option><option value="Drink">Thức uống</option><option value="Combo">Combo</option></select></div><div className="staff-food-grid">{filteredFoods.map((food) => <article className={`staff-food-card ${food.isAvailable ? "" : "unavailable"}`} key={food._id}><div className="staff-food-image">{food.imageUrl ? <img src={food.imageUrl} alt={food.name} onError={(event) => { event.currentTarget.style.display = "none"; }} /> : "🍿"}</div><div className="staff-food-body"><div className="staff-food-heading"><h3>{food.name}</h3><span>{food.type === "Food" ? "Đồ ăn" : food.type === "Drink" ? "Thức uống" : "Combo"}</span></div><p>{food.description || "Chưa có mô tả."}</p><strong>{formatCurrency(food.price)}</strong><div className="staff-food-actions"><button onClick={() => changeAvailability(food)} className={food.isAvailable ? "staff-action-btn pause" : "staff-action-btn confirm"}>{food.isAvailable ? "Ngừng bán" : "Mở bán"}</button><button className="staff-action-btn" onClick={() => editFood(food)}>Sửa</button><button className="staff-action-btn danger" onClick={() => removeFood(food)}>Xóa</button></div></div></article>)}{!loading && !filteredFoods.length && <div className="staff-empty">Chưa có món nào.</div>}</div></section><aside className="staff-food-form-card"><h2>{editingFood ? "Cập nhật món" : "Thêm món mới"}</h2><form onSubmit={submitFood}><label>Tên món<input required value={foodForm.name} onChange={(event) => setFoodForm({ ...foodForm, name: event.target.value })}/></label><label>Loại<select value={foodForm.type} onChange={(event) => setFoodForm({ ...foodForm, type: event.target.value })}><option value="Food">Đồ ăn</option><option value="Drink">Thức uống</option><option value="Combo">Combo</option></select></label><label>Giá bán<input type="number" min="0" required value={foodForm.price} onChange={(event) => setFoodForm({ ...foodForm, price: event.target.value })}/></label><label>Ảnh (URL)<input value={foodForm.imageUrl} onChange={(event) => setFoodForm({ ...foodForm, imageUrl: event.target.value })}/></label><label>Mô tả<textarea rows="3" value={foodForm.description} onChange={(event) => setFoodForm({ ...foodForm, description: event.target.value })}/></label><div className="staff-form-actions"><button className="staff-action-btn confirm" type="submit">{editingFood ? "Lưu thay đổi" : "Thêm món"}</button>{editingFood && <button type="button" className="staff-action-btn" onClick={() => { setEditingFood(null); setFoodForm(emptyFood); }}>Hủy</button>}</div></form></aside></div></div>}
    </main>
  </div>;
}

function Stat({ value, label, color }) { return <div className="staff-stat-card"><div className="staff-stat-icon" style={{ color, background: `${color}22` }}>●</div><div><div className="staff-stat-value">{value}</div><div className="staff-stat-label">{label}</div></div></div>; }
