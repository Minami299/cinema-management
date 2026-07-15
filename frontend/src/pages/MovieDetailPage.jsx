import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import axiosClient from "../services/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import "./MovieDetailPage.css";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();

  // States cho luồng đặt vé
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [availableFoods, setAvailableFoods] = useState([]);
  const [foodQuantities, setFoodQuantities] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const [showtimesRes, foodsRes] = await Promise.all([
          axiosClient.get(`/showtimes/movie/${id}`),
          axiosClient.get("/food-items/available"),
        ]);
        if (showtimesRes.data.success) {
          setShowtimes(showtimesRes.data.data);
        }
        if (foodsRes.data.success) {
          setAvailableFoods(foodsRes.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu đặt vé:", err);
      }
    };
    fetchBookingData();
  }, [id]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`http://localhost:9999/api/movies/${id}`);
        setMovie(res.data.data);
      } catch (err) {
        setError("Không thể tải dữ liệu phim. Vui lòng thử lại sau.");
        console.error("Lỗi lấy chi tiết phim:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);



  const posterUrl = useMemo(
    () =>
      movie?.posterUrl ||
      movie?.bannerUrl ||
      "https://via.placeholder.com/500x750?text=No+Poster",
    [movie],
  );

  const bannerUrl = useMemo(
    () =>
      movie?.bannerUrl ||
      movie?.posterUrl ||
      "https://via.placeholder.com/1200x640?text=Movie+Banner",
    [movie],
  );

  // Lấy ra danh sách ngày chiếu duy nhất từ các showtimes
  const showtimeDates = useMemo(() => {
    const dates = showtimes.map((st) => {
      if (!st.date) return "";
      return new Date(st.date).toISOString().split("T")[0];
    });
    return [...new Set(dates)].filter(Boolean).sort();
  }, [showtimes]);

  // Lọc danh sách showtimes cụ thể theo ngày đã chọn
  const filteredShowtimes = (() => {
    if (!selectedDate) return [];
    return showtimes.filter((st) => {
      if (!st.date) return false;
      const dStr = new Date(st.date).toISOString().split("T")[0];
      return dStr === selectedDate;
    });
  })();

  // Hàm chọn suất chiếu
  const handleSelectShowtime = (st) => {
    setSelectedShowtime(st);
    setSelectedSeats([]);
  };

  // Hàm chọn ghế
  const handleSelectSeat = (seatNumber) => {
    const seatObj = selectedShowtime?.seatStatus?.find((s) => s.seatNumber === seatNumber);
    if (seatObj?.status === "Booked") return; // Ghế đã bán, không chọn được

    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  // Hàm thay đổi số lượng đồ ăn kèm
  const handleFoodQtyChange = (foodId, change) => {
    setFoodQuantities((prev) => {
      const currentQty = prev[foodId] || 0;
      const nextQty = Math.max(0, currentQty + change);
      return { ...prev, [foodId]: nextQty };
    });
  };

  // Tính toán số tiền
  const ticketAmount = useMemo(() => {
    if (!selectedShowtime) return 0;
    return selectedSeats.length * (selectedShowtime.ticketPrice || 0);
  }, [selectedShowtime, selectedSeats]);

  const foodAmount = useMemo(() => {
    let sum = 0;
    availableFoods.forEach((food) => {
      const qty = foodQuantities[food._id] || 0;
      sum += qty * (food.price || 0);
    });
    return sum;
  }, [availableFoods, foodQuantities]);

  const totalAmount = useMemo(() => {
    return ticketAmount + foodAmount;
  }, [ticketAmount, foodAmount]);

  // Hàm xử lý mở modal xác nhận đặt vé
  const handleConfirmBooking = () => {
    if (!user) {
      alert("Vui lòng đăng nhập trước khi đặt vé.");
      navigate("/login");
      return;
    }

    if (!selectedShowtime) {
      alert("Vui lòng chọn suất chiếu.");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế ngồi.");
      return;
    }

    setShowConfirmModal(true);
  };

  // Hàm thực tế lưu đơn hàng lên cơ sở dữ liệu
  const executeBooking = async () => {
    setBookingLoading(true);
    try {
      const bookingPayload = {
        showtimeId: selectedShowtime._id,
        tickets: selectedSeats.map((seatNumber) => ({
          seatNumber,
          price: selectedShowtime.ticketPrice,
        })),
        foods: Object.entries(foodQuantities)
          .filter((entry) => entry[1] > 0)
          .map(([foodId, qty]) => {
            const foodObj = availableFoods.find((f) => f._id === foodId);
            return {
              foodItem: foodId,
              quantity: qty,
              price: foodObj?.price || 0,
            };
          }),
        paymentMethod,
        totalAmount,
      };

      const res = await axiosClient.post("/bookings", bookingPayload);
      if (res.data.success) {
        alert("Đặt vé thành công!");
        setShowConfirmModal(false);
        navigate("/profile");
      } else {
        alert("Đặt vé thất bại: " + res.data.message);
      }
    } catch (err) {
      console.error("Lỗi đặt vé:", err);
      alert("Lỗi đặt vé: " + (err.response?.data?.message || err.message));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-loading">Đang tải thông tin phim...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-error">
          <p>{error || "Không tìm thấy phim."}</p>
          <button
            className="movie-detail-secondary-btn"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      {/* 1. HERO SECTION WITH FULL BANNER */}
      <div className="movie-detail-hero">
        <div className="movie-detail-banner">
          <img src={bannerUrl} alt={movie.title} />
        </div>

        <div className="movie-detail-hero-content">
          <div className="movie-detail-poster">
            <img src={posterUrl} alt={`${movie.title} poster`} />
          </div>

          <div className="movie-detail-info-header">
            <p className="movie-detail-subtitle">
              {movie.status || "Now Showing"}
            </p>
            <h1 className="movie-detail-title">{movie.title}</h1>
            
            <div className="movie-detail-tags">
              {movie.ageRating && (
                <span className="movie-detail-tag rating-tag">{movie.ageRating}</span>
              )}
              {movie.movieLanguage && (
                <span className="movie-detail-tag">{movie.movieLanguage}</span>
              )}
              <span className="movie-detail-tag">
                {movie.status || "Coming Soon"}
              </span>
            </div>

            <div className="movie-detail-score-wrap">
              <div className="movie-detail-stars">
                {Array.from({ length: 5 }).map((_, starIdx) => {
                  const rating = movie.rating || 0;
                  const fill = starIdx + 1 <= rating / 2 ? "currentColor" : "none";
                  return (
                    <svg
                      key={starIdx}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={fill}
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ marginRight: "2px" }}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  );
                })}
              </div>
              <span className="movie-detail-rating-value">
                {Number(movie.rating || 0).toFixed(1)}
              </span>
              <span className="movie-detail-reviews-count">
                ({movie.numReviews || 0} đánh giá)
              </span>
            </div>

            <div className="movie-detail-actions">
              <button
                className="movie-detail-btn"
                onClick={() => {
                  const bookEl = document.getElementById("book");
                  if (bookEl) {
                    bookEl.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate(`/movie/${id}#book`);
                  }
                }}
              >
                Đặt Vé Ngay
              </button>
              {movie.trailerUrl && (
                <button
                  className="movie-detail-secondary-btn"
                  onClick={() => window.open(movie.trailerUrl, "_blank")}
                >
                  Xem Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="movie-detail-main-grid">
        {/* Cột trái (70%) */}
        <div className="movie-content-left">
          <div className="movie-detail-description">
            <h2 className="movie-content-section-title">Nội Dung Phim</h2>
            <p className="movie-detail-overview">
              {movie.synopsis || "Chưa có mô tả phim."}
            </p>
          </div>

          <div className="movie-detail-cast-section">
            <h2 className="movie-content-section-title">Diễn Viên Chính</h2>
            <div className="movie-detail-cast">
              {(movie.cast?.length ? movie.cast : ["Chưa cập nhật"]).map(
                (name, idx) => (
                  <span key={idx} className="movie-detail-cast-item">
                    {name}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Cột phải (30%) */}
        <div className="movie-content-right">
          <div className="movie-detail-info-card">
            <div className="movie-detail-info-list">
              <div className="movie-detail-info-row">
                <div className="movie-detail-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="movie-detail-info-text">
                  <span className="movie-detail-info-label">Khởi chiếu</span>
                  <span className="movie-detail-info-val">{formatDate(movie.releaseDate)}</span>
                </div>
              </div>

              <div className="movie-detail-info-row">
                <div className="movie-detail-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="movie-detail-info-text">
                  <span className="movie-detail-info-label">Thời lượng</span>
                  <span className="movie-detail-info-val">
                    {movie.duration ? `${movie.duration} phút` : "Chưa cập nhật"}
                  </span>
                </div>
              </div>

              <div className="movie-detail-info-row">
                <div className="movie-detail-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="movie-detail-info-text">
                  <span className="movie-detail-info-label">Đạo diễn</span>
                  <span className="movie-detail-info-val">{movie.director || "Chưa cập nhật"}</span>
                </div>
              </div>

              <div className="movie-detail-info-row">
                <div className="movie-detail-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div className="movie-detail-info-text">
                  <span className="movie-detail-info-label">Thể loại</span>
                  <span className="movie-detail-info-val">
                    {Array.isArray(movie.genre)
                      ? movie.genre.join(", ")
                      : movie.genre || "Chưa cập nhật"}
                  </span>
                </div>
              </div>

              <div className="movie-detail-info-row">
                <div className="movie-detail-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                </div>
                <div className="movie-detail-info-text">
                  <span className="movie-detail-info-label">Ngôn ngữ</span>
                  <span className="movie-detail-info-val">{movie.movieLanguage || "Chưa cập nhật"}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="movie-detail-footer-note">
            Thông tin chi tiết được cập nhật theo dữ liệu hệ thống CinemaHub.
          </p>
        </div>
      </div>

      {/* ================= LUỒNG ĐẶT VÉ XEM PHIM ================= */}
      <div className="movie-detail-booking-section" id="book">
        <h2 className="movie-booking-title">ĐẶT VÉ XEM PHIM</h2>

        {/* BƯỚC 1: CHỌN SUẤT CHIẾU */}
        <div className="movie-booking-step">
          <h3 className="movie-booking-step-title">
            <span>1</span> Chọn Suất Chiếu
          </h3>

          {showtimes.length === 0 ? (
            <p style={{ color: "var(--md-muted)", fontSize: "0.95rem" }}>
              Hiện chưa có lịch chiếu cho bộ phim này.
            </p>
          ) : (
            <div className="showtime-selectors-grid">
              {/* Chọn Ngày */}
              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--md-muted)", marginBottom: "8px" }}>Chọn ngày chiếu:</p>
                <div className="showtime-dates-list">
                  {showtimeDates.map((dateStr) => {
                    const formatted = new Date(dateStr).toLocaleDateString("vi-VN", {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                    });
                    return (
                      <button
                        key={dateStr}
                        className={`showtime-date-btn ${selectedDate === dateStr ? "active" : ""}`}
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedShowtime(null);
                          setSelectedSeats([]);
                        }}
                      >
                        {formatted}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chọn Giờ (Chỉ hiển thị khi đã chọn ngày) */}
              {selectedDate && (
                <div>
                  <p style={{ fontSize: "0.9rem", color: "var(--md-muted)", marginBottom: "8px" }}>Chọn giờ chiếu:</p>
                  <div className="showtime-times-list">
                    {filteredShowtimes.map((st) => (
                      <button
                        key={st._id}
                        className={`showtime-time-btn ${selectedShowtime?._id === st._id ? "active" : ""}`}
                        onClick={() => handleSelectShowtime(st)}
                      >
                        {st.startTime} ~ {st.endTime}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BƯỚC 2: CHỌN GHẾ */}
        {selectedShowtime && (
          <div className="movie-booking-step">
            <h3 className="movie-booking-step-title">
              <span>2</span> Chọn Ghế Ngồi (Phòng: {selectedShowtime.room?.name} - Giá: {selectedShowtime.ticketPrice?.toLocaleString("vi-VN")} VNĐ/ghế)
            </h3>

            <div className="seat-map-container">
              <div className="seat-screen">
                <span className="seat-screen-text">MÀN HÌNH CHIẾU PHIM</span>
              </div>

              <div className="seat-grid">
                {(selectedShowtime.seatStatus && selectedShowtime.seatStatus.length > 0
                  ? selectedShowtime.seatStatus
                  : Array.from({ length: 60 }).map((_, idx) => {
                      const row = ["A", "B", "C", "D", "E", "F"][Math.floor(idx / 10)];
                      const col = (idx % 10) + 1;
                      return { seatNumber: `${row}${col}`, status: "Available" };
                    })
                ).map((seat) => {
                  const isBooked = seat.status === "Booked";
                  const isSelected = selectedSeats.includes(seat.seatNumber);
                  let seatClass = "";
                  if (isBooked) seatClass = "booked";
                  else if (isSelected) seatClass = "selected";

                  return (
                    <button
                      key={seat.seatNumber}
                      className={`seat-item ${seatClass}`}
                      disabled={isBooked}
                      onClick={() => handleSelectSeat(seat.seatNumber)}
                      title={`Ghế ${seat.seatNumber}`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>

              <div className="seat-legend">
                <div className="legend-item">
                  <div className="legend-color available"></div>
                  <span>Ghế trống</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color selected"></div>
                  <span>Ghế đang chọn</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color booked"></div>
                  <span>Ghế đã bán</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 3: CHỌN ĐỒ ĂN KÈM */}
        {selectedShowtime && selectedSeats.length > 0 && (
          <div className="movie-booking-step">
            <h3 className="movie-booking-step-title">
              <span>3</span> Chọn Đồ Ăn & Thức Uống (Combo kèm theo)
            </h3>

            <div className="food-items-grid">
              {availableFoods.map((food) => {
                const qty = foodQuantities[food._id] || 0;
                return (
                  <div className="food-item-card" key={food._id}>
                    <img
                      className="food-item-img"
                      src={food.imageUrl || "https://via.placeholder.com/70x70?text=Combo"}
                      alt={food.name}
                      onError={(e) => {
                        e.target.style.background = "rgba(255,255,255,0.05)";
                        e.target.src = "https://via.placeholder.com/70x70?text=Combo";
                      }}
                    />
                    <div className="food-item-info">
                      <p className="food-item-name">{food.name}</p>
                      <span className="food-item-price">{food.price?.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                    <div className="food-quantity-selector">
                      <button
                        className="food-qty-btn"
                        onClick={() => handleFoodQtyChange(food._id, -1)}
                      >
                        -
                      </button>
                      <span className="food-qty-value">{qty}</span>
                      <button
                        className="food-qty-btn"
                        onClick={() => handleFoodQtyChange(food._id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BƯỚC 4: TÓM TẮT VÀ THANH TOÁN */}
        {selectedShowtime && selectedSeats.length > 0 && (
          <div className="movie-booking-step">
            <h3 className="movie-booking-step-title">
              <span>4</span> Tóm Tắt & Thanh Toán
            </h3>

            <div className="booking-summary-card">
              <div className="summary-row">
                <span>Bộ phim:</span>
                <strong style={{ color: "#fff" }}>{movie.title}</strong>
              </div>
              <div className="summary-row">
                <span>Suất chiếu:</span>
                <span>
                  {selectedShowtime.startTime} ~ {selectedShowtime.endTime} ({new Date(selectedShowtime.date).toLocaleDateString("vi-VN")})
                </span>
              </div>
              <div className="summary-row">
                <span>Rạp / Phòng:</span>
                <span>{selectedShowtime.cinema?.name} / Phòng {selectedShowtime.room?.name}</span>
              </div>
              <div className="summary-row">
                <span>Ghế đã chọn:</span>
                <strong style={{ color: "#10b981" }}>{selectedSeats.join(", ")}</strong>
              </div>
              <div className="summary-row">
                <span>Tiền vé ({selectedSeats.length} ghế):</span>
                <span>{ticketAmount.toLocaleString("vi-VN")} VNĐ</span>
              </div>

              {foodAmount > 0 && (
                <div className="summary-row">
                  <span>Tiền đồ ăn combo:</span>
                  <span>{foodAmount.toLocaleString("vi-VN")} VNĐ</span>
                </div>
              )}

              <div className="summary-row total">
                <span>TỔNG TIỀN THANH TOÁN:</span>
                <span>{totalAmount.toLocaleString("vi-VN")} VNĐ</span>
              </div>

              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--md-muted)", marginBottom: "8px", fontWeight: "bold" }}>
                  Chọn phương thức thanh toán:
                </p>
                <div className="payment-method-selector">
                  <input
                    type="radio"
                    id="pay-cash"
                    name="pay-method"
                    className="payment-method-input"
                    checked={paymentMethod === "CASH"}
                    onChange={() => setPaymentMethod("CASH")}
                  />
                  <label htmlFor="pay-cash" className="payment-method-label">
                    Tiền mặt tại quầy (CASH)
                  </label>

                  <input
                    type="radio"
                    id="pay-momo"
                    name="pay-method"
                    className="payment-method-input"
                    checked={paymentMethod === "MOMO"}
                    onChange={() => setPaymentMethod("MOMO")}
                  />
                  <label htmlFor="pay-momo" className="payment-method-label">
                    Ví điện tử MoMo
                  </label>

                  <input
                    type="radio"
                    id="pay-vnpay"
                    name="pay-method"
                    className="payment-method-input"
                    checked={paymentMethod === "VNPAY"}
                    onChange={() => setPaymentMethod("VNPAY")}
                  />
                  <label htmlFor="pay-vnpay" className="payment-method-label">
                    Thanh toán VNPAY
                  </label>
                </div>
              </div>

              <button
                className="submit-booking-btn"
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? "Đang xử lý đặt vé..." : "XÁC NHẬN ĐẶT VÉ NGAY"}
              </button>
            </div>
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-content">
            <h3 className="modal-title">Xác Nhận Thanh Toán</h3>
            
            <div className="modal-body">
              <div className="modal-info-section">
                <p><strong>Phim:</strong> <span>{movie?.title}</span></p>
                <p><strong>Suất chiếu:</strong> <span>{selectedShowtime?.startTime} ~ {selectedShowtime?.endTime} ngày {new Date(selectedShowtime?.date).toLocaleDateString("vi-VN")}</span></p>
                <p><strong>Phòng:</strong> <span>{selectedShowtime?.room?.name} ({selectedShowtime?.cinema?.name})</span></p>
                <p><strong>Ghế đã chọn:</strong> <span>{selectedSeats.join(", ")}</span></p>
                {Object.entries(foodQuantities).filter(e => e[1] > 0).length > 0 && (
                  <p><strong>Đồ ăn combo:</strong> <span>{
                    Object.entries(foodQuantities)
                      .filter(e => e[1] > 0)
                      .map(([foodId, qty]) => {
                        const foodObj = availableFoods.find(f => f._id === foodId);
                        return `${foodObj?.name} (x${qty})`;
                      }).join(", ")
                  }</span></p>
                )}
                <p className="modal-total"><strong>Tổng tiền:</strong> <span>{totalAmount.toLocaleString("vi-VN")} VNĐ</span></p>
                <p><strong>Hình thức:</strong> <span>{
                  paymentMethod === "CASH" ? "Tiền mặt tại quầy (CASH)" :
                  paymentMethod === "MOMO" ? "Ví điện tử MoMo" : "Cổng thanh toán VNPAY"
                }</span></p>
              </div>

              {paymentMethod !== "CASH" && (
                <div className="modal-qr-section">
                  <p className="qr-title">Quét mã QR để thanh toán:</p>
                  <div className="qr-code-wrapper">
                    <img 
                      src={
                        paymentMethod === "MOMO" 
                          ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://nhantien.momo.vn/0379198883/${totalAmount}`)}`
                          : `https://img.vietqr.io/image/MB-0379198883-compact2.png?amount=${totalAmount}&addInfo=${encodeURIComponent(`Thanh toan ve ${movie?.title}`)}&accountName=CinemaHub`
                      } 
                      alt="Payment QR Code" 
                      className="payment-qr-img"
                    />
                  </div>
                  <p className="qr-note">* Vui lòng quét mã và hoàn tất chuyển khoản trước khi bấm Xác nhận.</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="modal-btn btn-cancel" 
                onClick={() => setShowConfirmModal(false)}
                disabled={bookingLoading}
              >
                Hủy bỏ
              </button>
              <button 
                className="modal-btn btn-confirm" 
                onClick={executeBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? "Đang xử lý..." : paymentMethod === "CASH" ? "Xác nhận đặt vé" : "Xác nhận đã thanh toán"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
