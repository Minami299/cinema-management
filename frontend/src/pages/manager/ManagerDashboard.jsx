import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ManagerMovieTable from "../../components/manager/ManagerMovieTable";
import ManagerMovieFormModal from "../../components/manager/ManagerMovieFormModal";
import ManagerShowtimeTable from "../../components/manager/ManagerShowtimeTable";
import ManagerShowtimeFormModal from "../../components/manager/ManagerShowtimeFormModal";
import ManagerCinemaRoomTable from "../../components/manager/ManagerCinemaRoomTable";
import ManagerCinemaRoomFormModal from "../../components/manager/ManagerCinemaRoomFormModal";
import movieService from "../../services/movieService";
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

const normalizeList = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
};


const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State for data
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for pagination
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [currentShowtimePage, setCurrentShowtimePage] = useState(1);
  const [movieSearchQuery, setMovieSearchQuery] = useState("");
  const moviesPerPage = 5;
  const showtimesPerPage = 5;

  // State for modals
  const [isMovieFormOpen, setIsMovieFormOpen] = useState(false);
  const [isShowtimeFormOpen, setIsShowtimeFormOpen] = useState(false);
  const [isCinemaRoomFormOpen, setIsCinemaRoomFormOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedCinemaRoom, setSelectedCinemaRoom] = useState(null);
  const [cinemaRoomType, setCinemaRoomType] = useState("cinema");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const roleName =
    user?.role && typeof user.role === "object" ? user.role.name : user?.role;

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const [movieRes, showtimeRes, cinemaRes, roomRes] = await Promise.all([
        movieService.movies.getAll(),
        movieService.showtimes.getAll(),
        movieService.cinemas.getAll(),
        movieService.rooms.getAll(),
      ]);

      setMovies(normalizeList(movieRes.data));
      setShowtimes(normalizeList(showtimeRes.data));
      setCinemas(normalizeList(cinemaRes.data));
      setRooms(normalizeList(roomRes.data));
      setCurrentMoviePage(1);
      setCurrentShowtimePage(1);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination
  const filteredMovies = movies.filter((movie) => {
    const query = movieSearchQuery.trim().toLowerCase();
    if (!query) return true;

    const genreText = Array.isArray(movie.genre)
      ? movie.genre.join(" ")
      : movie.genre || "";
    const castText = Array.isArray(movie.cast)
      ? movie.cast.join(" ")
      : movie.cast || "";

    return [movie.title, genreText, movie.director, castText, movie.status]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(query));
  });

  const totalMoviePages = Math.ceil(filteredMovies.length / moviesPerPage);
  const startMovieIndex = (currentMoviePage - 1) * moviesPerPage;
  const paginatedMovies = filteredMovies.slice(startMovieIndex, startMovieIndex + moviesPerPage);

  const totalShowtimePages = Math.ceil(showtimes.length / showtimesPerPage);
  const startShowtimeIndex = (currentShowtimePage - 1) * showtimesPerPage;
  const paginatedShowtimes = showtimes.slice(startShowtimeIndex, startShowtimeIndex + showtimesPerPage);

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayShowtimes = showtimes
    .filter((showtime) => {
      const showDate = showtime.date ? showtime.date.slice(0, 10) : "";
      return showDate === todayIso;
    })
    .slice(0, 4);

  const moviesShowingCount = movies.filter((movie) => movie.status === "Now Showing").length;
  const todayShowtimeCount = showtimes.filter((showtime) => {
    const showDate = showtime.date ? showtime.date.slice(0, 10) : "";
    return showDate === todayIso;
  }).length;
  const weeklyRevenueValue = showtimes.reduce((sum, showtime) => {
    if (!showtime.date || !showtime.ticketPrice) return sum;
    const date = new Date(showtime.date);
    const showDateKey = date.toISOString().slice(0, 10);
    const diffDays = Math.floor((new Date(todayIso) - new Date(showDateKey)) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays >= 7) return sum;
    const bookedSeats = showtime.seatStatus
      ? showtime.seatStatus.filter((seat) => seat.status === "Booked").length
      : 0;
    return sum + showtime.ticketPrice * bookedSeats;
  }, 0);

  const stats = [
    {
      label: "Phim đang chiếu",
      value: String(moviesShowingCount),
      change: "+3",
      color: "#e50914",
      icon: "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z",
    },
    {
      label: "Suất chiếu hôm nay",
      value: String(todayShowtimeCount),
      change: "+12",
      color: "#7c3aed",
      icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
    },
    {
      label: "Doanh thu tuần",
      value: `₫${weeklyRevenueValue.toLocaleString()}`,
      change: "+7%",
      color: "#10b981",
      icon: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  // Movie handlers
  const handleMovieEdit = (movie) => {
    setSelectedMovie(movie);
    setIsMovieFormOpen(true);
  };

  const handleMovieDelete = async (movie) => {
    if (window.confirm(`Delete movie "${movie.title}"?`)) {
      try {
        await movieService.movies.delete(movie._id);
        await loadData();
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  const handleMovieFormClose = () => {
    setIsMovieFormOpen(false);
    setSelectedMovie(null);
  };

  const handleMovieSubmit = async (payload) => {
    try {
      if (selectedMovie?._id) {
        await movieService.movies.update(selectedMovie._id, payload);
      } else {
        await movieService.movies.create(payload);
      }
      handleMovieFormClose();
      await loadData();
    } catch (error) {
      console.error("Error submitting movie:", error);
    }
  };

  // Showtime handlers
  const handleShowtimeEdit = (showtime) => {
    setSelectedShowtime(showtime);
    setIsShowtimeFormOpen(true);
  };

  const handleShowtimeDelete = async (showtime) => {
    if (window.confirm("Delete showtime?")) {
      try {
        await movieService.showtimes.delete(showtime._id);
        await loadData();
      } catch (error) {
        console.error("Error deleting showtime:", error);
      }
    }
  };

  const handleShowtimeFormClose = () => {
    setIsShowtimeFormOpen(false);
    setSelectedShowtime(null);
  };

  const handleShowtimeSubmit = async (payload) => {
    try {
      if (selectedShowtime?._id) {
        await movieService.showtimes.update(selectedShowtime._id, payload);
      } else {
        await movieService.showtimes.create(payload);
      }
      handleShowtimeFormClose();
      await loadData();
    } catch (error) {
      console.error("Error submitting showtime:", error);
    }
  };

  // Cinema/Room handlers
  const handleCinemaRoomEdit = (item, type) => {
    setSelectedCinemaRoom(item);
    setCinemaRoomType(type);
    setIsCinemaRoomFormOpen(true);
  };

  const handleCinemaRoomDelete = async (item, type) => {
    if (window.confirm(`Delete ${type}?`)) {
      try {
        if (type === "cinema") {
          await movieService.cinemas.delete(item._id);
        } else {
          await movieService.rooms.delete(item._id);
        }
        await loadData();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const handleCinemaRoomFormClose = () => {
    setIsCinemaRoomFormOpen(false);
    setSelectedCinemaRoom(null);
  };

  const handleCinemaRoomSubmit = async (payload) => {
    try {
      if (cinemaRoomType === "cinema") {
        if (selectedCinemaRoom?._id) {
          await movieService.cinemas.update(selectedCinemaRoom._id, payload);
        } else {
          await movieService.cinemas.create(payload);
        }
      } else {
        if (selectedCinemaRoom?._id) {
          await movieService.rooms.update(selectedCinemaRoom._id, payload);
        } else {
          await movieService.rooms.create(payload);
        }
      }
      handleCinemaRoomFormClose();
      await loadData();
    } catch (error) {
      console.error("Error submitting:", error);
    }
  }

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
              {stats.map((s, i) => (
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
                    <th>Ngày</th>
                    <th>Giờ chiếu</th>
                    <th>Ghế đã đặt</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {todayShowtimes.length > 0 ? (
                    todayShowtimes.map((showtime) => (
                      <tr key={showtime._id}>
                        <td style={{ color: "#e0e0f8", fontWeight: 500 }}>
                          {showtime.movie?.title || "-"}
                        </td>
                        <td style={{ color: "#8888aa" }}>
                          {showtime.cinema?.name || "-"}
                        </td>
                        <td style={{ color: "#8888aa" }}>
                          {showtime.room?.name || "-"}
                        </td>
                        <td style={{ color: "#8888aa" }}>
                          {showtime.date ? new Date(showtime.date).toLocaleDateString("vi-VN") : "-"}
                        </td>
                        <td>
                          <span className="manager-time-badge">{showtime.startTime || "-"}</span>
                        </td>
                        <td style={{ color: "#c0c0e0" }}>
                          {showtime.seatStatus ? showtime.seatStatus.filter((seat) => seat.status === "Booked").length : 0}
                        </td>
                        <td>
                          <span className="manager-table-status available">
                            {showtime.seatStatus && showtime.seatStatus.every((seat) => seat.status === "Booked")
                              ? "Hết chỗ"
                              : "Mở bán"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", color: "#8888aa", padding: "20px" }}>
                        Không có suất chiếu hôm nay.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MOVIES */}
        {activeNav === "movies" && (
          <div className="manager-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              <div className="manager-section-title">Danh sách phim</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%", justifyContent: "space-between" }}>
                <input
                  value={movieSearchQuery}
                  onChange={(e) => {
                    setMovieSearchQuery(e.target.value);
                    setCurrentMoviePage(1);
                  }}
                  placeholder="Tìm theo tên phim, thể loại, đạo diễn, diễn viên..."
                  style={{
                    flex: 1,
                    minWidth: 240,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #3d3d5a",
                    backgroundColor: "#12122a",
                    color: "#e0e0f8",
                  }}
                />
                <button
                  onClick={() => {
                    setSelectedMovie(null);
                    setIsMovieFormOpen(true);
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#7c3aed",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Add Movie
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ color: "#8888aa", textAlign: "center", padding: "40px" }}>
                Loading...
              </div>
            ) : (
              <ManagerMovieTable
                movies={paginatedMovies}
                onEdit={handleMovieEdit}
                onDelete={handleMovieDelete}
                currentPage={currentMoviePage}
                totalPages={totalMoviePages}
                onPageChange={setCurrentMoviePage}
              />
            )}

            <ManagerMovieFormModal
              isOpen={isMovieFormOpen}
              movie={selectedMovie}
              onClose={handleMovieFormClose}
              onSubmit={handleMovieSubmit}
            />
          </div>
        )}

        {/* SHOWTIMES */}
        {activeNav === "showtimes" && (
          <div className="manager-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div className="manager-section-title">Danh sách suất chiếu</div>
              <button
                onClick={() => {
                  setSelectedShowtime(null);
                  setIsShowtimeFormOpen(true);
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Add Showtime
              </button>
            </div>

            {loading ? (
              <div style={{ color: "#8888aa", textAlign: "center", padding: "40px" }}>
                Loading...
              </div>
            ) : (
              <ManagerShowtimeTable
                showtimes={paginatedShowtimes}
                movies={movies}
                rooms={rooms}
                onEdit={handleShowtimeEdit}
                onDelete={handleShowtimeDelete}
                currentPage={currentShowtimePage}
                totalPages={totalShowtimePages}
                onPageChange={setCurrentShowtimePage}
              />
            )}

            <ManagerShowtimeFormModal
              isOpen={isShowtimeFormOpen}
              showtime={selectedShowtime}
              movies={movies}
              rooms={rooms}
              cinemas={cinemas}
              onClose={handleShowtimeFormClose}
              onSubmit={handleShowtimeSubmit}
            />
          </div>
        )}

        {/* CINEMAS & ROOMS */}
        {activeNav === "cinemas" && (
          <div className="manager-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div className="manager-section-title">Rạp & Phòng Chiếu</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    setSelectedCinemaRoom(null);
                    setCinemaRoomType("cinema");
                    setIsCinemaRoomFormOpen(true);
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Add Cinema
                </button>
                <button
                  onClick={() => {
                    setSelectedCinemaRoom(null);
                    setCinemaRoomType("room");
                    setIsCinemaRoomFormOpen(true);
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Add Room
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: "#e0e0f8", marginBottom: 12 }}>Rạp Phim</h3>
              {loading ? (
                <div style={{ color: "#8888aa", textAlign: "center", padding: "40px" }}>
                  Loading...
                </div>
              ) : (
                <ManagerCinemaRoomTable
                  data={cinemas}
                  type="cinema"
                  cinemas={cinemas}
                  onEdit={handleCinemaRoomEdit}
                  onDelete={handleCinemaRoomDelete}
                />
              )}
            </div>

            <div>
              <h3 style={{ color: "#e0e0f8", marginBottom: 12 }}>Phòng Chiếu</h3>
              {loading ? (
                <div style={{ color: "#8888aa", textAlign: "center", padding: "40px" }}>
                  Loading...
                </div>
              ) : (
                <ManagerCinemaRoomTable
                  data={rooms}
                  type="room"
                  cinemas={cinemas}
                  onEdit={handleCinemaRoomEdit}
                  onDelete={handleCinemaRoomDelete}
                />
              )}
            </div>

            <ManagerCinemaRoomFormModal
              isOpen={isCinemaRoomFormOpen}
              itemType={cinemaRoomType}
              item={selectedCinemaRoom}
              cinemas={cinemas}
              onClose={handleCinemaRoomFormClose}
              onSubmit={handleCinemaRoomSubmit}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;
