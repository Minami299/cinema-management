import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
    </div>
  );
};

export default MovieDetailPage;
