import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../services/axiosClient";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState("booking");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 1. Khai báo state lưu danh sách phim thực tế từ MongoDB
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFav, setIsLoadingFav] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const [displayUser, setDisplayUser] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    createdAt: "",
  });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Khởi tạo thông tin người dùng từ Auth Context
  useEffect(() => {
    if (user) {
      const init = {
        _id: user._id || user.id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        createdAt: user.createdAt || "",
      };
      setTimeout(() => {
        setDisplayUser(init);
        setFormData({ name: init.name, email: init.email, phone: init.phone });
      }, 0);
    }
  }, [user]);

  // 2. Gọi API lấy danh sách yêu thích thực tế khi có mã người dùng (displayUser._id)
  useEffect(() => {
    if (!displayUser?._id) return;

    const fetchFavorites = async () => {
      setIsLoadingFav(true);
      try {
        const response = await axiosClient.get(`/users/${displayUser._id}/favorites`);
        const result = response.data;

        if (result.success) {
          // Lưu mảng các bộ phim đã được populate (có trường poster) vào state
          setFavorites(result.data);
        } else {
          console.error("Lỗi từ server:", result.message);
        }
      } catch (error) {
        console.error("Lỗi kết nối API favorites:", error.message);
      } finally {
        setIsLoadingFav(false);
      }
    };

    fetchFavorites();
  }, [displayUser?._id]);

  useEffect(() => {
    if (!displayUser?._id) return;

    const fetchBookings = async () => {
      setIsLoadingBookings(true);
      try {
        const response = await axiosClient.get(`/bookings/history/${displayUser._id}`);
        if (response.data.success) {
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử đặt vé:", error.message);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [displayUser?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateProfile = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Tên không được để trống!";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) errs.email = "Email không được để trống!";
    else if (!emailRe.test(formData.email))
      errs.email = "Định dạng email không hợp lệ!";
    const phoneRe = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (formData.phone && !phoneRe.test(formData.phone))
      errs.phone = "Số điện thoại gồm 10 số, bắt đầu bằng 03/05/07/08/09!";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePassword = () => {
    const errs = {};
    if (!passwordData.oldPassword)
      errs.oldPassword = "Vui lòng nhập mật khẩu cũ!";
    if (!passwordData.newPassword)
      errs.newPassword = "Vui lòng nhập mật khẩu mới!";
    else if (passwordData.newPassword.length < 6)
      errs.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự!";
    if (passwordData.newPassword !== passwordData.confirmPassword)
      errs.confirmPassword = "Mật khẩu xác nhận không khớp!";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    try {
      const response = await axiosClient.put(
        `/users/${displayUser._id}`,
        formData,
      );
      const result = response.data;
      if (!result.success) throw new Error(result.message || "Có lỗi xảy ra!");
      const updated = result.data;
      localStorage.setItem("user", JSON.stringify(updated));
      setDisplayUser({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        createdAt: updated.createdAt || displayUser.createdAt,
      });
      if (typeof updateUser === "function") updateUser(updated);
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  const handleSavePassword = async () => {
    if (!validatePassword()) return;
    try {
      const response = await axiosClient.patch(
        `/users/${displayUser._id}/password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
      );
      const result = response.data;
      if (!result.success) throw new Error(result.message || "Đổi mật khẩu thất bại!");
      alert("Đổi mật khẩu thành công!");
      setIsChangingPassword(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  const handleCancelProfile = () => {
    setFormData({
      name: displayUser.name,
      email: displayUser.email,
      phone: displayUser.phone,
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleCancelPassword = () => {
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    setIsChangingPassword(false);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) logout();
  };

  const initials = displayUser.name
    ? displayUser.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const memberSince = displayUser.createdAt
    ? new Date(displayUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "January 2024";

  return (
    <div className="pp-page">
      {/* ── HEADER ── */}
      <header className="pp-nav">
        <div className="pp-nav-inner">
          <div className="pp-logo" onClick={() => navigate("/")}>
            <div className="pp-logo-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="2" y="7" width="20" height="15" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>
            <span className="pp-logo-text">
              Cinema<span>Hub</span>
            </span>
          </div>
          <nav className="pp-nav-links">
            <span onClick={() => navigate("/")} className="pp-nav-link">
              Home
            </span>
            <span onClick={() => navigate("/#movies")} className="pp-nav-link">
              Movies
            </span>
            <span onClick={() => navigate("/#cinemas")} className="pp-nav-link">
              Cinemas
            </span>
            <span
              onClick={() => navigate("/#promotions")}
              className="pp-nav-link"
            >
              Promotions
            </span>
            <span onClick={() => navigate("/#contact")} className="pp-nav-link">
              Contact
            </span>
          </nav>
          <div className="pp-nav-actions">
            <button className="pp-icon-btn pp-icon-btn--active" title="Profile">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="pp-login-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <main className="pp-main">
        {/* User Card */}
        <div className="pp-user-card">
          <div className="pp-user-left">
            <div className="pp-avatar">{initials}</div>
            <div className="pp-user-info">
              <h1 className="pp-user-name">{displayUser.name || "User"}</h1>
              <p className="pp-user-email">{displayUser.email}</p>
              <div className="pp-user-badges">
                <span className="pp-member-since">
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pp-tabs">
          <button
            className={`pp-tab ${activeTab === "booking" ? "pp-tab--active" : ""}`}
            onClick={() => setActiveTab("booking")}
          >
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
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Booking History
          </button>
          <button
            className={`pp-tab ${activeTab === "favorites" ? "pp-tab--active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
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
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Favorites
          </button>
          <button
            className={`pp-tab ${activeTab === "profile" ? "pp-tab--active" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              setIsEditing(false);
              setIsChangingPassword(false);
            }}
          >
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "booking" && (
          <div className="pp-tab-content">
            {isLoadingBookings ? (
              <p className="pp-loading-text" style={{ textAlign: "center", color: "#9ca3af", padding: "20px" }}>
                Đang tải lịch sử đặt vé...
              </p>
            ) : bookings.length === 0 ? (
              <p className="pp-empty-text" style={{ textAlign: "center", color: "#9ca3af", padding: "20px" }}>
                Bạn chưa đặt vé nào.
              </p>
            ) : (
              bookings.map((b) => {
                const movieTitle = b.showtime?.movie?.title || "Phim chưa cập nhật";
                const posterUrl = b.showtime?.movie?.posterUrl || "https://via.placeholder.com/90x130?text=No+Poster";
                const cinemaName = b.showtime?.cinema?.name || "Rạp chưa cập nhật";
                const roomName = b.showtime?.room?.name || "N/A";
                const showDate = b.showtime?.date
                  ? new Date(b.showtime.date).toLocaleDateString("vi-VN")
                  : "N/A";
                const showTime = b.showtime?.startTime || "N/A";
                const seatsStr = b.tickets?.map((t) => t.seatNumber).join(", ") || "N/A";
                const totalVal = b.totalAmount
                  ? b.totalAmount.toLocaleString("vi-VN") + " VNĐ"
                  : "0 VNĐ";

                let statusText = "Chờ thanh toán";
                let statusClass = "pp-status-badge--pending";
                if (b.status === "Confirmed") {
                  statusText = "Đã xác nhận";
                  statusClass = "pp-status-badge--completed";
                } else if (b.status === "Cancelled") {
                  statusText = "Đã hủy";
                  statusClass = "pp-status-badge--cancelled";
                }

                return (
                  <div className="pp-booking-card" key={b._id || b.id}>
                    <img
                      className="pp-booking-poster"
                      src={posterUrl}
                      alt={movieTitle}
                      onError={(e) => {
                        e.target.style.background = "#1e1e24";
                        e.target.src = "https://via.placeholder.com/90x130?text=No+Poster";
                      }}
                    />
                    <div className="pp-booking-info">
                      <div className="pp-booking-top">
                        <div>
                          <h3 className="pp-booking-title">{movieTitle}</h3>
                          <p className="pp-booking-cinema">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {cinemaName} - Phòng {roomName}
                          </p>
                          {b.foods && b.foods.length > 0 && (
                            <p className="pp-booking-cinema" style={{ marginTop: "4px", fontSize: "0.8rem", color: "#a78bfa" }}>
                              Đồ ăn: {b.foods.map(f => `${f.foodItem?.name || "Combo"} (x${f.quantity})`).join(", ")}
                            </p>
                          )}
                        </div>
                        <span className={`pp-status-badge ${statusClass}`}>
                          {statusText}
                        </span>
                      </div>
                      <div className="pp-booking-meta">
                        <span className="pp-meta-item">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {showDate}
                        </span>
                        <span className="pp-meta-item">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {showTime}
                        </span>
                        <span className="pp-meta-item">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          Ghế: {seatsStr}
                        </span>
                      </div>
                      <div className="pp-booking-footer">
                        <span className="pp-booking-total">Tổng tiền: {totalVal}</span>
                        <button 
                          className="pp-view-ticket-btn"
                          onClick={() => setSelectedTicket(b)}
                        >
                          Chi tiết vé
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* DANH SÁCH FAVORITES ĐÃ ĐƯỢC ĐỒNG BỘ ĐỌC TRƯỜNG POSTER */}
        {activeTab === "favorites" && (
          <div className="pp-favorites-grid">
            {isLoadingFav ? (
              <p className="pp-loading-text">Đang tải danh sách yêu thích...</p>
            ) : favorites.length === 0 ? (
              <p className="pp-empty-text">Danh sách phim yêu thích trống.</p>
            ) : (
              favorites.map((movie) => (
                <div className="pp-fav-card" key={movie._id}>
                  <div className="pp-fav-poster-wrap">
                    <img
                      className="pp-fav-poster"
                      // Đọc chính xác trường .posterUrl từ MongoDB trả về
                      src={movie.posterUrl || "placeholder-image-url.png"}
                      alt={movie.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.background = "#1e1e24";
                      }}
                    />
                    {movie.duration && (
                      <span className="pp-fav-duration">
                        {movie.duration} phút
                      </span>
                    )}
                  </div>
                  <p className="pp-fav-title">{movie.title}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="pp-profile-section">
            {!isChangingPassword ? (
              <div className="pp-info-card">
                <h2 className="pp-info-heading">Personal Information</h2>
                <div className="pp-info-grid">
                  <div className="pp-info-field">
                    <label className="pp-field-label">Full Name</label>
                    {isEditing ? (
                      <>
                        <input
                          className={`pp-field-input ${errors.name ? "pp-field-input--err" : ""}`}
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {errors.name && (
                          <span className="pp-field-error">{errors.name}</span>
                        )}
                      </>
                    ) : (
                      <p className="pp-field-value">
                        {displayUser.name || "—"}
                      </p>
                    )}
                  </div>
                  <div className="pp-info-field">
                    <label className="pp-field-label">Email</label>
                    {isEditing ? (
                      <>
                        <input
                          className={`pp-field-input ${errors.email ? "pp-field-input--err" : ""}`}
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && (
                          <span className="pp-field-error">{errors.email}</span>
                        )}
                      </>
                    ) : (
                      <p className="pp-field-value pp-field-value--red">
                        {displayUser.email || "—"}
                      </p>
                    )}
                  </div>
                  <div className="pp-info-field">
                    <label className="pp-field-label">Phone</label>
                    {isEditing ? (
                      <>
                        <input
                          className={`pp-field-input ${errors.phone ? "pp-field-input--err" : ""}`}
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0987654321"
                        />
                        {errors.phone && (
                          <span className="pp-field-error">{errors.phone}</span>
                        )}
                      </>
                    ) : (
                      <p className="pp-field-value">
                        {displayUser.phone || "—"}
                      </p>
                    )}
                  </div>
                  <div className="pp-info-field">
                    <label className="pp-field-label">Member Since</label>
                    <p className="pp-field-value">{memberSince}</p>
                  </div>
                </div>
                <div className="pp-profile-actions">
                  {isEditing ? (
                    <>
                      <button
                        className="pp-btn pp-btn--cancel"
                        onClick={handleCancelProfile}
                      >
                        Cancel
                      </button>
                      <button
                        className="pp-btn pp-btn--save"
                        onClick={handleSaveProfile}
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="pp-btn pp-btn--edit"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </button>
                      <button
                        className="pp-btn pp-btn--pwd"
                        onClick={() => setIsChangingPassword(true)}
                      >
                        Change Password
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="pp-info-card">
                <h2 className="pp-info-heading">Change Password</h2>
                <div className="pp-info-grid pp-info-grid--single">
                  <div className="pp-info-field">
                    <label className="pp-field-label">Current Password</label>
                    <input
                      className={`pp-field-input ${errors.oldPassword ? "pp-field-input--err" : ""}`}
                      type="password"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                    {errors.oldPassword && (
                      <span className="pp-field-error">
                        {errors.oldPassword}
                      </span>
                    )}
                  </div>
                  <div className="pp-info-field">
                    <label className="pp-field-label">New Password</label>
                    <input
                      className={`pp-field-input ${errors.newPassword ? "pp-field-input--err" : ""}`}
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="At least 6 characters"
                    />
                    {errors.newPassword && (
                      <span className="pp-field-error">
                        {errors.newPassword}
                      </span>
                    )}
                  </div>
                  <div className="pp-info-field">
                    <label className="pp-field-label">
                      Confirm New Password
                    </label>
                    <input
                      className={`pp-field-input ${errors.confirmPassword ? "pp-field-input--err" : ""}`}
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Re-enter new password"
                    />
                    {errors.confirmPassword && (
                      <span className="pp-field-error">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>
                <div className="pp-profile-actions">
                  <button
                    className="pp-btn pp-btn--cancel"
                    onClick={handleCancelPassword}
                  >
                    Cancel
                  </button>
                  <button
                    className="pp-btn pp-btn--save"
                    onClick={handleSavePassword}
                  >
                    Save Password
                  </button>
                </div>
              </div>
            )}
            <button className="pp-logout-btn" onClick={handleLogout}>
              Log out of account
            </button>
          </div>
        )}
      </main>
      {selectedTicket && (
        <div className="ticket-modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="ticket-card-wrapper" onClick={(e) => e.stopPropagation()}>
            {/* Cuống vé trái */}
            <div className="ticket-left">
              <div className="ticket-movie-poster" style={{ backgroundImage: `url(${selectedTicket.showtime?.movie?.posterUrl || "https://via.placeholder.com/150x220?text=No+Poster"})` }}></div>
              <div className="ticket-info">
                <span className="ticket-badge">{
                  selectedTicket.status === "Confirmed" ? "ĐÃ XÁC NHẬN" :
                  selectedTicket.status === "Cancelled" ? "ĐÃ HỦY" : "CHỜ THANH TOÁN"
                }</span>
                <h2 className="ticket-title">{selectedTicket.showtime?.movie?.title}</h2>
                <div className="ticket-grid">
                  <div className="ticket-grid-item">
                    <span className="grid-label">RẠP</span>
                    <span className="grid-val">{selectedTicket.showtime?.cinema?.name || "CinemaHub"}</span>
                  </div>
                  <div className="ticket-grid-item">
                    <span className="grid-label">PHÒNG</span>
                    <span className="grid-val">{selectedTicket.showtime?.room?.name}</span>
                  </div>
                  <div className="ticket-grid-item">
                    <span className="grid-label">NGÀY CHIẾU</span>
                    <span className="grid-val">{selectedTicket.showtime?.date ? new Date(selectedTicket.showtime.date).toLocaleDateString("vi-VN") : "N/A"}</span>
                  </div>
                  <div className="ticket-grid-item">
                    <span className="grid-label">SUẤT CHIẾU</span>
                    <span className="grid-val">{selectedTicket.showtime?.startTime}</span>
                  </div>
                  <div className="ticket-grid-item text-large">
                    <span className="grid-label">GHẾ</span>
                    <span className="grid-val highlight">{selectedTicket.tickets?.map(t => t.seatNumber).join(", ")}</span>
                  </div>
                  <div className="ticket-grid-item text-large">
                    <span className="grid-label">TỔNG TIỀN</span>
                    <span className="grid-val highlight">{(selectedTicket.totalAmount || 0).toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>
                {selectedTicket.foods && selectedTicket.foods.length > 0 && (
                  <div className="ticket-foods-section">
                    <span className="grid-label">ĐỒ ĂN KÈM:</span>
                    <span className="foods-list">{selectedTicket.foods.map(f => `${f.foodItem?.name || "Combo"} (x${f.quantity})`).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dải phân cách cuống vé răng cưa */}
            <div className="ticket-divider">
              <div className="divider-hole divider-hole-top"></div>
              <div className="divider-dashed-line"></div>
              <div className="divider-hole divider-hole-bottom"></div>
            </div>

            {/* Cuống vé phải (Soát vé) */}
            <div className="ticket-right">
              <div className="ticket-right-info">
                <span className="ticket-sub-label">CinemaHub ticket</span>
                <h3 className="ticket-sub-title">{selectedTicket.showtime?.movie?.title}</h3>
                <div className="ticket-sub-grid">
                  <div>
                    <span>PHÒNG</span>
                    <strong>{selectedTicket.showtime?.room?.name}</strong>
                  </div>
                  <div>
                    <span>SUẤT</span>
                    <strong>{selectedTicket.showtime?.startTime}</strong>
                  </div>
                  <div>
                    <span>GHẾ</span>
                    <strong>{selectedTicket.tickets?.map(t => t.seatNumber).join(", ")}</strong>
                  </div>
                </div>
              </div>
              <div className="ticket-qr-code">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`VE_${selectedTicket._id || selectedTicket.id}`)}`} 
                  alt="Ticket QR Code" 
                />
                <span className="ticket-id">ID: {selectedTicket._id ? selectedTicket._id.substring(selectedTicket._id.length - 8).toUpperCase() : "N/A"}</span>
              </div>
            </div>
            <button className="ticket-close-btn" onClick={() => setSelectedTicket(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
