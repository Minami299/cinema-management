import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { movieApi } from "../services/movieService";
import axiosClient from "../services/axiosClient";
import "./HomePage.css";

const formatDateString = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Slide mặc định khi chưa có dữ liệu từ API
const defaultSlides = [
  {
    title: "Welcome to CinemaHub",
    description: "Experience the best movies in comfort and style",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1400&q=80",
    movieId: null,
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const roleName = String(
    user?.role && typeof user.role === "object"
      ? user.role.name
      : user?.role || "",
  ).toUpperCase();
  const homePath = user && roleName !== "CUSTOMER" ? "/dashboard" : "/";
  const canManageFood = ["STAFF", "MANAGER", "ADMIN"].includes(roleName);
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [nowShowingPage, setNowShowingPage] = useState(1);
  const [comingSoonPage, setComingSoonPage] = useState(1);
  const [selectedNowShowingGenre, setSelectedNowShowingGenre] = useState("All");
  const [selectedComingSoonGenre, setSelectedComingSoonGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const MOVIES_PER_PAGE = 6;

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavoriteIds((prev) => (prev.length === 0 ? prev : []));
        return;
      }
      try {
        const userId = user._id || user.id;
        const res = await axiosClient.get(`/users/${userId}/favorites`);
        if (res.data && res.data.success) {
          setFavoriteIds(res.data.data.map((m) => m._id || m.id));
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách yêu thích:", error);
      }
    };
    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (movieId) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
      navigate("/login");
      return;
    }

    const userId = user._id || user.id;
    const isFavorite = favoriteIds.includes(movieId);

    try {
      if (isFavorite) {
        const res = await axiosClient.delete(`/users/${userId}/favorites`, {
          data: { movieId },
        });
        if (res.data && res.data.success) {
          setFavoriteIds((prev) => prev.filter((id) => id !== movieId));
        }
      } else {
        const res = await axiosClient.post(`/users/${userId}/favorites`, {
          movieId,
        });
        if (res.data && res.data.success) {
          setFavoriteIds((prev) => [...prev, movieId]);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật yêu thích:", error);
      alert(error.response?.data?.message || "Không thể cập nhật danh sách yêu thích.");
    }
  };

  useEffect(() => {
    if (!showDropdown) return;
    const closeDropdown = (e) => {
      if (!e.target.closest(".profile-dropdown-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [showDropdown]);

  useEffect(() => {
    if (searchQuery === "") return;
    const closeSearch = (e) => {
      if (!e.target.closest(".header-search-wrap")) {
        setSearchQuery("");
      }
    };
    document.addEventListener("click", closeSearch);
    return () => document.removeEventListener("click", closeSearch);
  }, [searchQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoadingMovies(true);
        const res = await movieApi.getAll();
        if (res.data && res.data.success) {
          setMovies(res.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchMovies();
  }, []);

  // Trích xuất thể loại cho Now Showing
  const nowShowingGenres = useMemo(() => {
    const genresSet = new Set();
    movies.filter(m => m.status === "Now Showing").forEach((movie) => {
      if (Array.isArray(movie.genre)) {
        movie.genre.forEach((g) => genresSet.add(g.trim()));
      } else if (movie.genre) {
        movie.genre.split(",").forEach((g) => genresSet.add(g.trim()));
      }
    });
    return ["All", ...Array.from(genresSet).sort()];
  }, [movies]);

  // Trích xuất thể loại cho Coming Soon
  const comingSoonGenres = useMemo(() => {
    const genresSet = new Set();
    movies.filter(m => m.status === "Coming Soon").forEach((movie) => {
      if (Array.isArray(movie.genre)) {
        movie.genre.forEach((g) => genresSet.add(g.trim()));
      } else if (movie.genre) {
        movie.genre.split(",").forEach((g) => genresSet.add(g.trim()));
      }
    });
    return ["All", ...Array.from(genresSet).sort()];
  }, [movies]);

  // Xử lý đổi thể loại (reset phân trang về 1)
  const handleNowShowingGenreChange = (genre) => {
    setSelectedNowShowingGenre(genre);
    setNowShowingPage(1);
  };

  const handleComingSoonGenreChange = (genre) => {
    setSelectedComingSoonGenre(genre);
    setComingSoonPage(1);
  };

  // Xử lý thay đổi ô tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Xây dựng danh sách slide từ các phim Now Showing có bannerUrl
  const nowShowingMovies = movies.filter((m) => m.status === "Now Showing");
  const comingSoonMovies = movies.filter((m) => m.status === "Coming Soon");

  // Lọc phim theo thể loại đã chọn
  const filteredNowShowingMovies = useMemo(() => {
    let result = nowShowingMovies;

    if (selectedNowShowingGenre !== "All") {
      result = result.filter((m) => {
        if (Array.isArray(m.genre)) {
          return m.genre.some(g => g.trim() === selectedNowShowingGenre);
        } else if (m.genre) {
          return m.genre.split(",").map(g => g.trim()).includes(selectedNowShowingGenre);
        }
        return false;
      });
    }

    return result;
  }, [nowShowingMovies, selectedNowShowingGenre]);

  const filteredComingSoonMovies = useMemo(() => {
    let result = comingSoonMovies;

    if (selectedComingSoonGenre !== "All") {
      result = result.filter((m) => {
        if (Array.isArray(m.genre)) {
          return m.genre.some(g => g.trim() === selectedComingSoonGenre);
        } else if (m.genre) {
          return m.genre.split(",").map(g => g.trim()).includes(selectedComingSoonGenre);
        }
        return false;
      });
    }

    return result;
  }, [comingSoonMovies, selectedComingSoonGenre]);

  // Kết quả tìm kiếm hiển thị trên dropdown
  const searchResults = useMemo(() => {
    if (searchQuery.trim() === "") return [];
    const q = searchQuery.toLowerCase().trim();
    return movies.filter((m) => m.title && m.title.toLowerCase().includes(q));
  }, [movies, searchQuery]);

  const paginatedNowShowing = useMemo(() => {
    const startIndex = (nowShowingPage - 1) * MOVIES_PER_PAGE;
    return filteredNowShowingMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  }, [filteredNowShowingMovies, nowShowingPage, MOVIES_PER_PAGE]);

  const totalNowShowingPages = Math.ceil(filteredNowShowingMovies.length / MOVIES_PER_PAGE);

  const paginatedComingSoon = useMemo(() => {
    const startIndex = (comingSoonPage - 1) * MOVIES_PER_PAGE;
    return filteredComingSoonMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  }, [filteredComingSoonMovies, comingSoonPage, MOVIES_PER_PAGE]);

  const totalComingSoonPages = Math.ceil(filteredComingSoonMovies.length / MOVIES_PER_PAGE);

  const heroSlides =
    nowShowingMovies.length > 0
      ? nowShowingMovies.slice(0, 3).map((m) => ({
          title: m.title,
          description: m.synopsis || "",
          image:
            m.bannerUrl ||
            m.posterUrl ||
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1400&q=80",
          movieId: m._id,
        }))
      : defaultSlides;

  // Tự động chuyển slide mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handlePrevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="cinemahub-home">
      {/* HEADER */}
      <header className="premium-header">
        <div className="header-container">
          <div className="logo-box" onClick={() => navigate(homePath)}>
            <div className="logo-icon-wrap">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2-2 0-2-.9-2-2zm-9 4H5v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8h6v8zm8 0h-6V8h6v8z" />
              </svg>
            </div>
            <div className="logo-text">
              Cinema<span>Hub</span>
            </div>
          </div>

          <nav className="nav-menu">
            <button
              type="button"
              className="nav-item-link active"
              onClick={() => navigate(homePath)}
            >
              Home
            </button>
            <a href="#movies" className="nav-item-link">
              Movies
            </a>
            <a href="#cinemas" className="nav-item-link">
              Cinemas
            </a>
            <a href="#promotions" className="nav-item-link">
              Promotions
            </a>
            {canManageFood && (
              <>
                <button
                  type="button"
                  className="nav-item-link"
                  onClick={() => navigate("/staff/tickets")}
                >
                  List Tickets
                </button>
                <button
                  type="button"
                  className="nav-item-link"
                  onClick={() => navigate("/staff/food")}
                >
                  Food & Drink
                </button>
              </>
            )}
            <a href="#contact" className="nav-item-link">
              Contact
            </a>
          </nav>

          <div className="header-actions">
            {/* SEARCH BOX */}
            <div className="header-search-wrap">
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="header-search-input"
              />
              <svg
                className="search-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>

              {searchQuery.trim() !== "" && (
                <div className="search-results-dropdown">
                  {searchResults.length > 0 ? (
                    searchResults.map((movie) => (
                      <div 
                        key={movie._id} 
                        className="search-result-item"
                        onClick={() => {
                          setSearchQuery("");
                          navigate(`/movie/${movie._id}`);
                        }}
                      >
                        <img 
                          src={movie.posterUrl || "https://via.placeholder.com/40x60"} 
                          alt={movie.title} 
                          className="result-item-poster"
                        />
                        <div className="result-item-info">
                          <p className="result-item-title">{movie.title}</p>
                          <span className="result-item-genre">
                            {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
                          </span>
                        </div>
                        <span className={`result-item-status-badge ${movie.status === "Now Showing" ? "now-showing" : "coming-soon"}`}>
                          {movie.status === "Now Showing" ? "Đang chiếu" : "Sắp chiếu"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="search-no-results">Không tìm thấy phim phù hợp</div>
                  )}
                </div>
              )}
            </div>

            {(!user || roleName !== "CUSTOMER") && (
              <button
                className="login-action-btn"
                onClick={() => navigate(user ? "/dashboard" : "/login")}
              >
                {user ? "Dashboard" : "Login / Register"}
              </button>
            )}
            <div className="profile-dropdown-container">
              <button
                className="profile-action-btn"
                onClick={() => {
                  if (user) {
                    setShowDropdown(!showDropdown);
                  } else {
                    navigate("/login");
                  }
                }}
                title={user ? "Account" : "Login"}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              {user && showDropdown && (
                <div className="profile-dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </div>
                  <div
                    className="dropdown-item logout"
                    onClick={() => {
                      setShowDropdown(false);
                      if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
                        logout();
                      }
                    }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* HERO CAROUSEL */}
      <section className="hero-carousel">
        <div className="carousel-track">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`carousel-slide ${idx === activeSlide ? "active" : ""}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="slide-bg-image"
              />
              <div className="slide-overlay-gradient"></div>
              <div className="slide-content-wrap">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-desc">{slide.description}</p>
                <button
                  className="btn-book-now"
                  onClick={() =>
                    slide.movieId ? navigate(`/movie/${slide.movieId}`) : null
                  }
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2-2 0-2-.9-2-2zm-9 4H5v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8h6v8zm8 0h-6V8h6v8z" />
                  </svg>
                  Book Tickets Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-arrow-btn left"
          onClick={handlePrevSlide}
          aria-label="Previous Slide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          className="carousel-arrow-btn right"
          onClick={handleNextSlide}
          aria-label="Next Slide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div className="carousel-dots-indicator">
          {heroSlides.map((_, idx) => (
            <div
              key={idx}
              className={`carousel-dot ${idx === activeSlide ? "active" : ""}`}
              onClick={() => setActiveSlide(idx)}
            ></div>
          ))}
        </div>
      </section>

      {/* NOW SHOWING */}
      <section className="section-wrapper" id="movies">
        <div className="section-header-row">
          <h2 className="section-main-title">Now Showing</h2>
          <a href="#movies" className="section-view-all-link">
            View All
          </a>
        </div>

        {/* NOW SHOWING GENRE FILTER */}
        <div className="genre-filter-container inline-filter">
          <span className="filter-label">Thể loại:</span>
          <div className="genre-buttons-list">
            {nowShowingGenres.map((genre) => (
              <button
                key={genre}
                className={`genre-filter-btn ${selectedNowShowingGenre === genre ? "active" : ""}`}
                onClick={() => handleNowShowingGenreChange(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {loadingMovies && (
          <p
            style={{
              color: "var(--theme-text-secondary)",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            Loading...
          </p>
        )}

        {!loadingMovies && nowShowingMovies.length === 0 && (
          <p
            style={{
              color: "var(--theme-text-secondary)",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            No movies currently showing. Please check back later.
          </p>
        )}

        <div className="movies-responsive-grid">
          {paginatedNowShowing.map((movie) => (
            <div className="movie-showcase-card" key={movie._id}>
              <div className="card-poster-area">
                <img
                  src={movie.posterUrl || "https://via.placeholder.com/300x450"}
                  alt={movie.title}
                />
                <button
                  className={`favorite-btn ${favoriteIds.includes(movie._id) ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(movie._id);
                  }}
                  title="Yêu thích"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={favoriteIds.includes(movie._id) ? "#ef4444" : "none"}
                    stroke={favoriteIds.includes(movie._id) ? "#ef4444" : "#ffffff"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <div className="rating-indicator-badge">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="#ffb400"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{movie.rating ? movie.rating.toFixed(1) : "0.0"}</span>
                </div>
              </div>
              <div className="card-info-area">
                <h3 className="card-movie-title" title={movie.title}>
                  {movie.title}
                </h3>
                <div className="card-movie-genre">
                  {Array.isArray(movie.genre)
                    ? movie.genre.join(", ")
                    : movie.genre || ""}
                </div>
                <div className="card-movie-meta-item">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{movie.duration || "--"} min</span>
                </div>
              </div>
              <button
                className="btn-card-action"
                onClick={() => navigate(`/movie/${movie._id}`)}
              >
                Book Tickets
              </button>
            </div>
          ))}
        </div>

        {totalNowShowingPages > 1 && (
          <div className="pagination-wrapper">
            <button 
              className="pagination-btn" 
              onClick={() => setNowShowingPage(p => Math.max(1, p - 1))}
              disabled={nowShowingPage === 1}
            >
              &larr; Previous
            </button>
            <div className="pagination-pages">
              {Array.from({ length: totalNowShowingPages }).map((_, idx) => (
                <button 
                  key={idx}
                  className={`pagination-page-btn ${nowShowingPage === idx + 1 ? "active" : ""}`}
                  onClick={() => setNowShowingPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button 
              className="pagination-btn" 
              onClick={() => setNowShowingPage(p => Math.min(totalNowShowingPages, p + 1))}
              disabled={nowShowingPage === totalNowShowingPages}
            >
              Next &rarr;
            </button>
          </div>
        )}
      </section>

      {/* COMING SOON */}
      <section className="section-wrapper" style={{ paddingTop: 0 }}>
        <div className="section-header-row">
          <h2 className="section-main-title">Coming Soon</h2>
        </div>

        {/* COMING SOON GENRE FILTER */}
        <div className="genre-filter-container inline-filter">
          <span className="filter-label">Thể loại:</span>
          <div className="genre-buttons-list">
            {comingSoonGenres.map((genre) => (
              <button
                key={genre}
                className={`genre-filter-btn ${selectedComingSoonGenre === genre ? "active" : ""}`}
                onClick={() => handleComingSoonGenreChange(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {!loadingMovies && comingSoonMovies.length === 0 && (
          <p
            style={{
              color: "var(--theme-text-secondary)",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            No upcoming movies at this time.
          </p>
        )}

        <div className="movies-responsive-grid">
          {paginatedComingSoon.map((movie) => (
            <div className="movie-showcase-card" key={movie._id}>
              <div className="card-poster-area">
                <img
                  src={movie.posterUrl || "https://via.placeholder.com/300x450"}
                  alt={movie.title}
                />
                <button
                  className={`favorite-btn ${favoriteIds.includes(movie._id) ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(movie._id);
                  }}
                  title="Yêu thích"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={favoriteIds.includes(movie._id) ? "#ef4444" : "none"}
                    stroke={favoriteIds.includes(movie._id) ? "#ef4444" : "#ffffff"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <div className="coming-soon-indicator-badge">Coming Soon</div>
              </div>
              <div className="card-info-area">
                <h3 className="card-movie-title" title={movie.title}>
                  {movie.title}
                </h3>
                <div
                  className="card-movie-genre"
                  style={{ marginBottom: "12px" }}
                >
                  {Array.isArray(movie.genre)
                    ? movie.genre.join(", ")
                    : movie.genre || ""}
                </div>
                <div className="card-movie-meta-item">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{formatDateString(movie.releaseDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalComingSoonPages > 1 && (
          <div className="pagination-wrapper">
            <button 
              className="pagination-btn" 
              onClick={() => setComingSoonPage(p => Math.max(1, p - 1))}
              disabled={comingSoonPage === 1}
            >
              &larr; Previous
            </button>
            <div className="pagination-pages">
              {Array.from({ length: totalComingSoonPages }).map((_, idx) => (
                <button 
                  key={idx}
                  className={`pagination-page-btn ${comingSoonPage === idx + 1 ? "active" : ""}`}
                  onClick={() => setComingSoonPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button 
              className="pagination-btn" 
              onClick={() => setComingSoonPage(p => Math.min(totalComingSoonPages, p + 1))}
              disabled={comingSoonPage === totalComingSoonPages}
            >
              Next &rarr;
            </button>
          </div>
        )}
      </section>

      {/* SPECIAL PROMOTIONS */}
      <section
        className="section-wrapper"
        id="promotions"
        style={{ paddingTop: 0 }}
      >
        <div className="section-header-row">
          <h2 className="section-main-title">Special Promotions</h2>
        </div>
        <div className="promotions-horizontal-layout">
          <div className="promo-offer-card">
            <span className="promo-discount-badge">50% Off</span>
            <h3 className="promo-offer-title">Member Monday</h3>
            <p className="promo-offer-desc">
              50% off all tickets every Monday for members
            </p>
          </div>
          <div className="promo-offer-card">
            <span className="promo-discount-badge">30% Off</span>
            <h3 className="promo-offer-title">Student Special</h3>
            <p className="promo-offer-desc">
              Get 30% discount with valid student ID
            </p>
          </div>
          <div className="promo-offer-card">
            <span className="promo-discount-badge">Buy 4 Get 1</span>
            <h3 className="promo-offer-title">Family Package</h3>
            <p className="promo-offer-desc">
              Buy 4 tickets, get 1 free + free popcorn
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="premium-footer" id="contact">
        <div className="footer-grid-container">
          <div className="footer-info-col">
            <div className="logo-box">
              <div className="logo-icon-wrap">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2-2 0-2-.9-2-2zm-9 4H5v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8h6v8zm8 0h-6V8h6v8z" />
                </svg>
              </div>
              <div className="logo-text">
                Cinema<span>Hub</span>
              </div>
            </div>
            <p className="footer-slogan">
              Experience the best movies in comfort and style. Your ultimate
              cinema destination.
            </p>
            <div className="footer-social-bar">
              <a href="#" className="footer-social-icon" aria-label="Facebook">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="footer-social-icon" aria-label="Instagram">
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
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="footer-social-icon" aria-label="Twitter">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="footer-social-icon" aria-label="YouTube">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <a href="/">Home</a>
              </li>
              <li className="footer-link-item">
                <a href="#movies">Movies</a>
              </li>
              <li className="footer-link-item">
                <a href="#cinemas">Cinemas</a>
              </li>
              <li className="footer-link-item">
                <a href="#promotions">Promotions</a>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Support</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item">
                <a href="#">Help Center</a>
              </li>
              <li className="footer-link-item">
                <a href="#">Terms of Service</a>
              </li>
              <li className="footer-link-item">
                <a href="#">Privacy Policy</a>
              </li>
              <li className="footer-link-item">
                <a href="#">FAQs</a>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Contact Us</h4>
            <div className="footer-contact-details">
              <div className="footer-contact-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>info@cinemahub.com</span>
              </div>
              <div className="footer-contact-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>1900-xxxx</span>
              </div>
              <div className="footer-contact-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom-copyright">
          © 2026 CinemaHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
