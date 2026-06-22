import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/api/movies/${id}`);

        setMovie(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết phim:", err);

        // debug thêm
        if (err.response) {
          console.log("STATUS:", err.response.status);
          console.log("DATA:", err.response.data);
        }
      }
    };

    fetchDetail();
  }, [id]);

  if (!movie) return <div>Đang tải thông tin phim...</div>;

  return (
    <div className="detail-page">
      <h1>{movie.title}</h1>

      <img src={movie.posterUrl} alt={movie.title} />

      <p>{movie.synopsis}</p>

      <p>
        Thể loại:{" "}
        {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
      </p>
    </div>
  );
};

export default MovieDetailPage;
