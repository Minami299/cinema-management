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
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [availableFoods, setAvailableFoods] = useState([]);
  const [foodQuantities, setFoodQuantities] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [bookingLoading, setBookingLoading] = useState(false);

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

  // Lọc ra danh sách rạp chiếu theo ngày đã chọn
  const filteredCinemas = useMemo(() => {
    if (!selectedDate) return [];
    const cinemas = showtimes
      .filter((st) => {
        if (!st.date) return false;
        const dStr = new Date(st.date).toISOString().split("T")[0];
        return dStr === selectedDate;
      })
      .map((st) => st.cinema);

    // Loại bỏ các rạp trùng lặp dựa trên _id
    const uniqueCinemas = [];
    const map = new Map();
    for (const item of cinemas) {
      if (item && !map.has(item._id)) {
        map.set(item._id, true);
        uniqueCinemas.push(item);
      }
    }
    return uniqueCinemas;
  }, [showtimes, selectedDate]);

  // Lọc danh sách showtimes cụ thể theo ngày và rạp đã chọn
  const filteredShowtimes = useMemo(() => {
    if (!selectedDate || !selectedCinema) return [];
    return showtimes.filter((st) => {
      if (!st.date || !st.cinema) return false;
      const dStr = new Date(st.date).toISOString().split("T")[0];
      return dStr === selectedDate && st.cinema._id === selectedCinema;
    });
  }, [showtimes, selectedDate, selectedCinema]);

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

  // Hàm xử lý đặt vé
  const handleConfirmBooking = async () => {
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
      <div className="movie-detail-hero">
        <div className="movie-detail-banner">
          <img src={bannerUrl} alt={movie.title} />
        </div>

        <div className="movie-detail-grid">
          <div className="movie-detail-poster">
            <img src={posterUrl} alt={`${movie.title} poster`} />
          </div>

          <div className="movie-detail-info">
            <div className="movie-detail-headline">
              <p className="movie-detail-subtitle">
                {movie.status || "Now Showing"}
              </p>
              <h1 className="movie-detail-title">{movie.title}</h1>
              <div className="movie-detail-tags">
                {movie.ageRating && (
                  <span className="movie-detail-tag">{movie.ageRating}</span>
                )}
                {movie.movieLanguage && (
                  <span className="movie-detail-tag">
                    {movie.movieLanguage}
                  </span>
                )}
                <span className="movie-detail-tag status">
                  {movie.status || "Coming Soon"}
                </span>
              </div>
            </div>

            <div className="movie-detail-score">
              <strong>{Number(movie.rating || 0).toFixed(1)}</strong>
              <small>{movie.numReviews || 0} đánh giá</small>
            </div>

            <div className="movie-detail-actions">
              <button
                className="movie-detail-btn"
                onClick={() => navigate(`/movie/${id}#book`)}
              >
                Đặt vé ngay
              </button>
              {movie.trailerUrl && (
                <button
                  className="movie-detail-secondary-btn"
                  onClick={() => window.open(movie.trailerUrl, "_blank")}
                >
                  Xem trailer
                </button>
              )}
            </div>

            <div className="movie-detail-meta">
              <div className="movie-detail-meta-item">
                <span>Thể loại</span>
                <span>
                  {Array.isArray(movie.genre)
                    ? movie.genre.join(", ")
                    : movie.genre || "Chưa cập nhật"}
                </span>
              </div>
              <div className="movie-detail-meta-item">
                <span>Thời lượng</span>
                <span>
                  {movie.duration ? `${movie.duration} phút` : "Chưa cập nhật"}
                </span>
              </div>
              <div className="movie-detail-meta-item">
                <span>Đạo diễn</span>
                <span>{movie.director || "Chưa cập nhật"}</span>
              </div>
              <div className="movie-detail-meta-item">
                <span>Khởi chiếu</span>
                <span>{formatDate(movie.releaseDate)}</span>
              </div>
            </div>

            <div className="movie-detail-description">
              <div>
                <h2 className="movie-detail-heading">Nội dung phim</h2>
                <p className="movie-detail-overview">
                  {movie.synopsis || "Chưa có mô tả phim."}
                </p>
              </div>

              <div className="movie-detail-grid-bottom">
                <div className="movie-detail-detail-card">
                  <h3>Cast chính</h3>
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

                <div className="movie-detail-detail-card">
                  <h3>Thông tin bổ sung</h3>
                  <ul className="movie-detail-detail-list">
                    <li>
                      <span>Trạng thái</span>
                      <span>{movie.status || "Chưa cập nhật"}</span>
                    </li>
                    <li>
                      <span>Ngôn ngữ</span>
                      <span>{movie.movieLanguage || "Chưa cập nhật"}</span>
                    </li>
                    <li>
                      <span>Điểm đánh giá</span>
                      <span>
                        {movie.rating ? movie.rating.toFixed(1) : "0.0"}
                      </span>
                    </li>
                    <li>
                      <span>Số review</span>
                      <span>{movie.numReviews || 0}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="movie-detail-footer">
              <p>Thông tin chi tiết cập nhật theo dữ liệu phim.</p>
            </div>
          </div>
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
                          setSelectedCinema("");
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

              {/* Chọn Rạp (Chỉ hiển thị khi đã chọn ngày) */}
              {selectedDate && (
                <div>
                  <p style={{ fontSize: "0.9rem", color: "var(--md-muted)", marginBottom: "8px" }}>Chọn rạp chiếu:</p>
                  <div className="showtime-cinemas-list">
                    {filteredCinemas.map((cinema) => (
                      <button
                        key={cinema._id}
                        className={`showtime-cinema-btn ${selectedCinema === cinema._id ? "active" : ""}`}
                        onClick={() => {
                          setSelectedCinema(cinema._id);
                          setSelectedShowtime(null);
                          setSelectedSeats([]);
                        }}
                      >
                        {cinema.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chọn Giờ (Chỉ hiển thị khi đã chọn rạp và ngày) */}
              {selectedDate && selectedCinema && (
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
                {selectedShowtime.seatStatus?.map((seat) => {
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
    </div>
  );
};

export default MovieDetailPage;
