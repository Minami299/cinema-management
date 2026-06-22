import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./ProfilePage.css";

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const MOCK_BOOKINGS = [
  {
    id: "b1",
    movie: "Echoes of Tomorrow",
    cinema: "CinemaHub Central",
    date: "June 15, 2026",
    time: "7:15 PM",
    seats: "D5, D6",
    total: "300,000 VND",
    status: "completed",
    poster: "https://image.tmdb.org/t/p/w200/1BIoJGKbXjdFDAqUEiA2VHqkJVt.jpg",
  },
  {
    id: "b2",
    movie: "Nebula Chronicles",
    cinema: "CinemaHub Downtown",
    date: "June 8, 2026",
    time: "5:30 PM",
    seats: "F8",
    total: "150,000 VND",
    status: "completed",
    poster: "https://image.tmdb.org/t/p/w200/9cqNxx0GxF0bAY082W5sxxASe4D.jpg",
  },
  {
    id: "b3",
    movie: "Quest for Glory",
    cinema: "CinemaHub Westside",
    date: "May 22, 2026",
    time: "8:00 PM",
    seats: "A1, A2, A3",
    total: "450,000 VND",
    status: "completed",
    poster: "https://image.tmdb.org/t/p/w200/aJTZdaUOaVRxRmQHOPl8UOb0R9E.jpg",
  },
];

const MOCK_FAVORITES = [
  {
    id: "f1",
    title: "Echoes of Tomorrow",
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w300/1BIoJGKbXjdFDAqUEiA2VHqkJVt.jpg",
  },
  {
    id: "f2",
    title: "Quest for Glory",
    rating: 8.7,
    poster: "https://image.tmdb.org/t/p/w300/aJTZdaUOaVRxRmQHOPl8UOb0R9E.jpg",
  },
  {
    id: "f3",
    title: "Nebula Chronicles",
    rating: 7.8,
    poster: "https://image.tmdb.org/t/p/w300/9cqNxx0GxF0bAY082W5sxxASe4D.jpg",
  },
  {
    id: "f4",
    title: "The Last Stand",
    rating: 8.1,
    poster: "https://image.tmdb.org/t/p/w300/hS5SThLEjUfPwl1JJKwJ6OYXVFQ.jpg",
  },
];
/* ───────────────────────────────────────────────────────────── */

const TIER_CONFIG = {
  bronze: {
    label: "Bronze Member",
    color: "#cd7f32",
    next: "Silver",
    nextPoints: 1000,
  },
  silver: {
    label: "Silver Member",
    color: "#9ca3af",
    next: "Gold",
    nextPoints: 2000,
  },
  gold: {
    label: "Gold Member",
    color: "#ffb400",
    next: "Platinum",
    nextPoints: 3000,
  },
  platinum: {
    label: "Platinum Member",
    color: "#a78bfa",
    next: null,
    nextPoints: null,
  },
};

function getTier(points) {
  if (points >= 3000) return "platinum";
  if (points >= 2000) return "gold";
  if (points >= 1000) return "silver";
  return "bronze";
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState("booking");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const rewardPoints = 2450;
  const tier = getTier(rewardPoints);
  const tierConfig = TIER_CONFIG[tier];

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

  useEffect(() => {
    if (user) {
      const init = {
        _id: user._id || user.id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        createdAt: user.createdAt || "",
      };
      setDisplayUser(init);
      setFormData({ name: init.name, email: init.email, phone: init.phone });
    }
  }, [user]);

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
    if (!formData.name.trim()) errs.name = "Ten khong duoc de trong!";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) errs.email = "Email khong duoc de trong!";
    else if (!emailRe.test(formData.email))
      errs.email = "Dinh dang email khong hop le!";
    const phoneRe = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (formData.phone && !phoneRe.test(formData.phone))
      errs.phone = "So dien thoai gom 10 so, bat dau bang 03/05/07/08/09!";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePassword = () => {
    const errs = {};
    if (!passwordData.oldPassword)
      errs.oldPassword = "Vui long nhap mat khau cu!";
    if (!passwordData.newPassword)
      errs.newPassword = "Vui long nhap mat khau moi!";
    else if (passwordData.newPassword.length < 6)
      errs.newPassword = "Mat khau moi phai co it nhat 6 ky tu!";
    if (passwordData.newPassword !== passwordData.confirmPassword)
      errs.confirmPassword = "Mat khau xac nhan khong khop!";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    try {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:9999/api/users/${displayUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(formData),
        },
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Co loi xay ra!");
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
      alert("Cap nhat thong tin thanh cong!");
      setIsEditing(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSavePassword = async () => {
    if (!validatePassword()) return;
    try {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:9999/api/users/${displayUser._id}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        },
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Doi mat khau that bai!");
      alert("Doi mat khau thanh cong!");
      setIsChangingPassword(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (e) {
      alert(e.message);
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
    if (window.confirm("Ban co chac chan muon dang xuat khong?")) logout();
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

  const progressPct = tierConfig.nextPoints
    ? Math.min((rewardPoints / tierConfig.nextPoints) * 100, 100)
    : 100;

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
                <span
                  className="pp-tier-badge"
                  style={{
                    background: tierConfig.color + "26",
                    color: tierConfig.color,
                    border: `1px solid ${tierConfig.color}66`,
                  }}
                >
                  {tierConfig.label}
                </span>
                <span className="pp-member-since">
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>
          <div className="pp-reward-box">
            <span className="pp-reward-label">Reward Points</span>
            <span className="pp-reward-value">
              {rewardPoints.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {tierConfig.next && (
          <div className="pp-progress-card">
            <div className="pp-progress-header">
              <span className="pp-progress-label">
                Progress to {tierConfig.next}
              </span>
              <span className="pp-progress-value">
                {rewardPoints.toLocaleString()} /{" "}
                {tierConfig.nextPoints.toLocaleString()} points
              </span>
            </div>
            <div className="pp-progress-track">
              <div
                className="pp-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

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
            {MOCK_BOOKINGS.map((b) => (
              <div className="pp-booking-card" key={b.id}>
                <img
                  className="pp-booking-poster"
                  src={b.poster}
                  alt={b.movie}
                  onError={(e) => {
                    e.target.style.background = "#1e1e24";
                    e.target.src = "";
                  }}
                />
                <div className="pp-booking-info">
                  <div className="pp-booking-top">
                    <div>
                      <h3 className="pp-booking-title">{b.movie}</h3>
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
                        {b.cinema}
                      </p>
                    </div>
                    <span className="pp-status-badge pp-status-badge--completed">
                      {b.status}
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
                      {b.date}
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
                      {b.time}
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
                      Seats: {b.seats}
                    </span>
                  </div>
                  <div className="pp-booking-footer">
                    <span className="pp-booking-total">Total: {b.total}</span>
                    <button className="pp-view-ticket-btn">View Ticket</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="pp-favorites-grid">
            {MOCK_FAVORITES.map((f) => (
              <div className="pp-fav-card" key={f.id}>
                <div className="pp-fav-poster-wrap">
                  <img
                    className="pp-fav-poster"
                    src={f.poster}
                    alt={f.title}
                    onError={(e) => {
                      e.target.style.background = "#1e1e24";
                    }}
                  />
                  <span className="pp-fav-rating">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="#ffb400"
                      stroke="none"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {f.rating}
                  </span>
                </div>
                <p className="pp-fav-title">{f.title}</p>
              </div>
            ))}
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
    </div>
  );
};

export default ProfilePage;
