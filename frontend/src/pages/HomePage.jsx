import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { movieApi } from "../services/movieService";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadError, setLoadError] = useState("");

  // State cho tính năng Quick Booking 3 bước
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await movieApi.getAll();
        setMovies(res.data.data || []);
      } catch (error) {
        setLoadError("Không thể tải danh sách phim từ hệ thống.");
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchMovies();
  }, []);

  const handleNextStep = () => {
    if (bookingStep === 1 && !selectedMovie)
      return alert("Vui lòng chọn phim!");
    if (bookingStep === 2 && !selectedTime)
      return alert("Vui lòng chọn suất chiếu!");
    setBookingStep((prev) => prev + 1);
  };

  const handleResetBooking = () => {
    setBookingStep(1);
    setSelectedMovie("");
    setSelectedTime("");
  };

  return (
    <div className="futuristic-minimal-ui">
      {/* EMBEDDED FIGMA-STYLE CSS */}
      <style>{`
        :root {
          --bg-clean: #ffffff;
          --bg-subtle: #f8fafc;
          --neon-cyan: #00f2fe;
          --neon-magenta: #ff007f;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border-color: #e2e8f0;
          --font-geometric: 'Inter', system-ui, -apple-system, sans-serif;
          --transition-figma: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .futuristic-minimal-ui {
          background-color: var(--bg-clean);
          color: var(--text-main);
          font-family: var(--font-geometric);
          min-height: 100vh;
          scroll-behavior: smooth;
          overflow-x: hidden;
        }

        /* LIGHT TRAILS ACCENTS */
        .neon-trail-top {
          position: fixed;
          top: 0;
          left: 25%;
          width: 50%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-magenta), transparent);
          z-index: 1001;
          pointer-events: none;
        }

        /* SLIM HEADER */
        .slim-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(15, 23, 42, 0.04);
        }

        .nav-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 14px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .slim-logo {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 3px;
          cursor: pointer;
          color: var(--text-main);
        }

        .slim-logo span {
          font-weight: 300;
          color: var(--text-muted);
        }

        .floating-menu {
          display: flex;
          gap: 40px;
        }

        .menu-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: var(--transition-figma);
        }

        .menu-link:hover {
          color: var(--text-main);
        }

        .nav-icons {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          color: var(--text-main);
          transition: var(--transition-figma);
          padding: 4px;
        }

        .icon-btn:hover {
          transform: scale(1.05);
          color: var(--neon-magenta);
        }

        /* SLEEK HERO SECTION */
        .minimal-hero {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          padding: 120px 40px 60px;
          max-width: 1300px;
          margin: 0 auto;
          gap: 60px;
        }

        .hero-info {
          flex: 1.2;
          max-width: 600px;
        }

        .hero-tag {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 4px;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 20px;
          display: block;
        }

        .hero-heading {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 24px;
        }

        .hero-heading span {
          font-weight: 300;
          font-style: italic;
          color: var(--text-muted);
        }

        .hero-desc {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .geometric-cta-group {
          display: flex;
          gap: 16px;
        }

        .btn-geo {
          padding: 14px 32px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          border: 1px solid var(--text-main);
          cursor: pointer;
          transition: var(--transition-figma);
          background: none;
        }

        .btn-geo-primary {
          background: var(--text-main);
          color: var(--bg-clean);
        }

        .btn-geo-primary:hover {
          background: var(--bg-clean);
          color: var(--text-main);
          box-shadow: -4px -4px 0 var(--neon-cyan), 4px 4px 0 var(--neon-magenta);
        }

        .btn-geo-secondary:hover {
          background: var(--bg-subtle);
          border-color: var(--text-muted);
        }

        .hero-motion-poster {
          flex: 0.8;
          position: relative;
          aspect-ratio: 16/10;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          overflow: hidden;
          transition: var(--transition-figma);
        }

        .hero-motion-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%);
          transition: var(--transition-figma);
        }

        .hero-motion-poster:hover {
          box-shadow: 0 30px 60px rgba(0,0,0,0.06);
          border-color: var(--neon-cyan);
        }

        .hero-motion-poster:hover img {
          filter: grayscale(0%);
          transform: scale(1.02);
        }

        /* 3-STEP QUICK BOOKING INTERFACE */
        .booking-system-section {
          background: var(--bg-subtle);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 80px 40px;
        }

        .booking-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          background: var(--bg-clean);
          border: 1px solid var(--border-color);
          padding: 40px;
          position: relative;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
        }

        .booking-steps-indicator {
          display: flex;
          gap: 32px;
        }

        .step-node {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .step-node.active {
          color: var(--text-main);
        }

        .step-node.active .node-number {
          background: var(--text-main);
          color: var(--bg-clean);
        }

        .node-number {
          width: 20px;
          height: 20px;
          border: 1px solid var(--border-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }

        .booking-body {
          min-height: 150px;
        }

        .form-select-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          animation: fadeIn 0.3s ease;
        }

        .geo-option-card {
          border: 1px solid var(--border-color);
          padding: 20px;
          cursor: pointer;
          text-align: center;
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition-figma);
        }

        .geo-option-card:hover, .geo-option-card.selected {
          border-color: var(--text-main);
          background: var(--bg-subtle);
        }

        .geo-option-card.selected {
          box-shadow: -3px 3px 0 var(--neon-cyan);
        }

        .booking-footer-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 40px;
        }

        /* NOW SHOWING GRID (UNADORNED HOVER REVEAL) */
        .catalog-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 100px 40px;
        }

        .section-title-minimal {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 48px;
          text-transform: uppercase;
        }

        .unadorned-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 40px;
        }

        .clean-movie-card {
          position: relative;
          aspect-ratio: 2/3;
          overflow: hidden;
          background: var(--bg-subtle);
          border: 1px solid var(--border-color);
          cursor: pointer;
        }

        .clean-movie-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-figma);
        }

        .reveal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.96);
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          opacity: 0;
          transition: var(--transition-figma);
          transform: translateY(10px);
          border: 2px solid var(--text-main);
        }

        .clean-movie-card:hover .reveal-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        .clean-movie-card:hover img {
          transform: scale(1.05);
        }

        .reveal-title {
          font-size: 1.3rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .reveal-meta {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-reveal-details {
          width: 100%;
          padding: 12px;
          background: var(--text-main);
          color: var(--bg-clean);
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
        }

        /* SLIM FOOTER */
        .slim-footer {
          border-top: 1px solid var(--border-color);
          padding: 40px;
          font-size: 0.8rem;
          color: var(--text-muted);
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* NEON LIGHT TRAIL */}
      <div className="neon-trail-top"></div>

      {/* HEADER */}
      <header className="slim-navbar">
        <div className="nav-container">
          <div className="slim-logo" onClick={() => navigate("/")}>
            CINEMA<span>X</span>
          </div>

          <nav className="floating-menu">
            <a href="#home" className="menu-link">
              Home
            </a>
            <a href="#booking" className="menu-link">
              Quick Book
            </a>
            <a href="#movies" className="menu-link">
              Now Showing
            </a>
          </nav>

          <div className="nav-icons">
            <button className="icon-btn" aria-label="Search">
              🔍
            </button>
            <button
              className="icon-btn"
              onClick={() => navigate(user ? "/profile" : "/login")}
              aria-label="Account"
            >
              👤
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="minimal-hero" id="home">
        <div className="hero-info">
          <span className="hero-tag">Digital-First Theater</span>
          <h1 className="hero-heading">
            Experience Cinema <span>Reimagined.</span>
          </h1>
          <p className="hero-desc">
            An ultra-clean interactive space designed for instantaneous booking,
            immersive original content tracking, and premium seat customization.
          </p>
          <div className="geometric-cta-group">
            <button
              className="btn-geo btn-geo-primary"
              onClick={() =>
                document
                  .getElementById("booking")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Quick Booking
            </button>
            <button className="btn-geo btn-geo-secondary">Explore</button>
          </div>
        </div>

        <div className="hero-motion-poster">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80"
            alt="Futuristic Motion Frame"
          />
        </div>
      </section>

      {/* INTERACTIVE 3-STEP QUICK BOOKING COMPONENT */}
      <section className="booking-system-section" id="booking">
        <div className="booking-wrapper">
          <div className="booking-header">
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              ⚡ Instant Ticket Machine
            </h2>
            <div className="booking-steps-indicator">
              <div className={`step-node ${bookingStep >= 1 ? "active" : ""}`}>
                <span className="node-number">1</span> Movie
              </div>
              <div className={`step-node ${bookingStep >= 2 ? "active" : ""}`}>
                <span className="node-number">2</span> Session
              </div>
              <div className={`step-node ${bookingStep >= 3 ? "active" : ""}`}>
                <span className="node-number">3</span> Pay
              </div>
            </div>
          </div>

          <div className="booking-body">
            {/* STEP 1: CHỌN PHIM */}
            {bookingStep === 1 && (
              <div className="form-select-grid">
                {movies.map((movie) => (
                  <div
                    key={movie._id}
                    className={`geo-option-card ${selectedMovie === movie.title ? "selected" : ""}`}
                    onClick={() => setSelectedMovie(movie.title)}
                  >
                    {movie.title}
                  </div>
                ))}
                {movies.length === 0 && (
                  <p style={{ color: "var(--text-muted)" }}>
                    Không tìm thấy phim có sẵn.
                  </p>
                )}
              </div>
            )}

            {/* STEP 2: CHỌN SUẤT CHIẾU */}
            {bookingStep === 2 && (
              <div className="form-select-grid">
                {[
                  "09:30 AM",
                  "13:15 PM",
                  "16:45 PM",
                  "20:00 PM",
                  "22:30 PM",
                ].map((time) => (
                  <div
                    key={time}
                    className={`geo-option-card ${selectedTime === time ? "selected" : ""}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3: XÁC NHẬN THANH TOÁN */}
            {bookingStep === 3 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 0",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <h3 style={{ fontWeight: 700, marginBottom: "12px" }}>
                  Ticket Invoice Summary
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Phim: <strong>{selectedMovie}</strong> | Suất chiếu:{" "}
                  <strong>{selectedTime}</strong>
                </p>
                <div
                  style={{
                    display: "inline-block",
                    margin: "24px 0",
                    height: "1px",
                    width: "100px",
                    background:
                      "linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta))",
                  }}
                ></div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "var(--neon-magenta)",
                    fontWeight: 700,
                  }}
                >
                  ● Gate ready to process digital banking API link
                </p>
              </div>
            )}
          </div>

          <div className="booking-footer-actions">
            {bookingStep > 1 && (
              <button
                className="btn-geo btn-geo-secondary"
                onClick={() => setBookingStep((prev) => prev - 1)}
              >
                Back
              </button>
            )}
            {bookingStep < 3 ? (
              <button
                className="btn-geo btn-geo-primary"
                onClick={handleNextStep}
              >
                Next Phase
              </button>
            ) : (
              <button
                className="btn-geo btn-geo-primary"
                onClick={handleResetBooking}
              >
                Book Another Ticket
              </button>
            )}
          </div>
        </div>
      </section>

      {/* NOW SHOWING GRID */}
      <section className="catalog-container" id="movies">
        <h2 className="section-title-minimal">Now Exhibiting</h2>

        {loadingMovies && (
          <p style={{ color: "var(--text-muted)" }}>
            Fetching digital core database...
          </p>
        )}
        {loadError && (
          <p style={{ color: "var(--neon-magenta)" }}>⚠️ {loadError}</p>
        )}

        <div className="unadorned-grid">
          {movies.map((movie) => (
            <article className="clean-movie-card" key={movie._id}>
              <img
                src={movie.poster || "https://via.placeholder.com/300x450"}
                alt={movie.title}
                loading="lazy"
              />
              <div className="reveal-overlay">
                <div>
                  <h3 className="reveal-title">{movie.title}</h3>
                  <p className="reveal-meta">{movie.genre || "Variant"}</p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      marginBottom: "20px",
                      fontWeight: 500,
                    }}
                  >
                    ⏱️ {movie.duration || "--"} MIN <br />⭐{" "}
                    {movie.rating || "N/A"} SCORE
                  </p>
                  <button className="btn-reveal-details">Access Node</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="slim-footer">
        <div>© 2026 CINEMAX. LAB ENVIRONMENT INTERFACE.</div>
        <div style={{ display: "flex", gap: "24px" }}>
          <span>LATENCY: 14MS</span>
          <span>STATUS: OPERATIONAL</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
