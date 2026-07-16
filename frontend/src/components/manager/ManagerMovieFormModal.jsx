import { useEffect, useMemo, useState } from "react";

const initialForm = {
  posterUrl: "",
  bannerUrl: "",
  title: "",
  synopsis: "",
  genre: "",
  duration: "",
  director: "",
  cast: "",
  trailerUrl: "",
  movieLanguage: "",
  ageRating: "",
  releaseDate: "",
  status: "Now Showing",
};

const ManagerMovieFormModal = ({ isOpen, movie, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditMode = useMemo(() => Boolean(movie?._id), [movie]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      posterUrl: movie?.posterUrl || "",
      bannerUrl: movie?.bannerUrl || "",
      title: movie?.title || "",
      synopsis: movie?.synopsis || "",
      genre: Array.isArray(movie?.genre)
        ? movie.genre.join(", ")
        : movie?.genre || "",
      duration: movie?.duration || "",
      director: movie?.director || "",
      cast: Array.isArray(movie?.cast)
        ? movie.cast.join(", ")
        : movie?.cast || "",
      trailerUrl: movie?.trailerUrl || "",
      movieLanguage: movie?.movieLanguage || "",
      ageRating: movie?.ageRating || "",
      releaseDate: movie?.releaseDate ? movie.releaseDate.split("T")[0] : "",
      status: movie?.status || "Now Showing",
    });

    setErrors({});
  }, [isOpen, movie]);

  if (!isOpen) return null;

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.posterUrl.trim()) nextErrors.posterUrl = "Poster URL is required";
    if (!formData.title.trim()) nextErrors.title = "Title is required";
    if (!formData.synopsis.trim()) nextErrors.synopsis = "Synopsis is required";
    if (!formData.genre.trim()) nextErrors.genre = "Genre is required";
    if (!formData.duration || Number(formData.duration) <= 0)
      nextErrors.duration = "Duration must be greater than 0";
    if (!formData.director.trim()) nextErrors.director = "Director is required";
    if (!formData.cast.trim()) nextErrors.cast = "Cast is required";
    if (!formData.movieLanguage.trim())
      nextErrors.movieLanguage = "Language is required";
    if (!formData.ageRating.trim())
      nextErrors.ageRating = "Age rating is required";
    if (!formData.releaseDate)
      nextErrors.releaseDate = "Release date is required";

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      ...formData,
      duration: Number(formData.duration),
      genre: formData.genre
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      cast: formData.cast
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    await onSubmit(payload);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1a1a2e",
          borderRadius: 8,
          padding: 24,
          maxWidth: 600,
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          border: "1px solid #2d2d4a",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ color: "#e0e0f8", marginBottom: 4 }}>
            {isEditMode ? "Edit Movie" : "Add Movie"}
          </h2>
          <p style={{ color: "#8888aa", fontSize: 14 }}>
            {isEditMode ? "Update movie information" : "Create a new movie"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Poster URL</label>
              <input
                name="posterUrl"
                className="manager-form-input"
                value={formData.posterUrl}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                placeholder="https://..."
              />
              {errors.posterUrl && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.posterUrl}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Banner URL</label>
              <input
                name="bannerUrl"
                className="manager-form-input"
                value={formData.bannerUrl}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                placeholder="https://..."
              />
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Title</label>
              <input
                name="title"
                className="manager-form-input"
                value={formData.title}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
              />
              {errors.title && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.title}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Duration (minutes)</label>
              <input
                name="duration"
                type="number"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.duration}
                onChange={handleChange}
              />
              {errors.duration && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.duration}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Genre</label>
              <input
                name="genre"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.genre}
                onChange={handleChange}
                placeholder="Action, Drama, etc"
              />
              {errors.genre && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.genre}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Director</label>
              <input
                name="director"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.director}
                onChange={handleChange}
              />
              {errors.director && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.director}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Trailer URL</label>
              <input
                name="trailerUrl"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.trailerUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Language</label>
              <input
                name="movieLanguage"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.movieLanguage}
                onChange={handleChange}
              />
              {errors.movieLanguage && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.movieLanguage}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Age Rating</label>
              <input
                name="ageRating"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.ageRating}
                onChange={handleChange}
                placeholder="P, PG-13, 16, 18"
              />
              {errors.ageRating && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.ageRating}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Release Date</label>
              <input
                name="releaseDate"
                type="date"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.releaseDate}
                onChange={handleChange}
              />
              {errors.releaseDate && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.releaseDate}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Status</label>
              <select
                name="status"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Now Showing">Now Showing</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Ended">Ended</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Cast</label>
            <input
              name="cast"
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "#2d2d4a",
                border: "1px solid #3d3d5a",
                borderRadius: 4,
                color: "#e0e0f8",
                boxSizing: "border-box",
              }}
              value={formData.cast}
              onChange={handleChange}
              placeholder="Actor 1, Actor 2, etc"
            />
            {errors.cast && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.cast}</div>}
          </div>

          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Synopsis</label>
            <textarea
              name="synopsis"
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "#2d2d4a",
                border: "1px solid #3d3d5a",
                borderRadius: 4,
                color: "#e0e0f8",
                boxSizing: "border-box",
                minHeight: 80,
                resize: "vertical",
              }}
              value={formData.synopsis}
              onChange={handleChange}
            />
            {errors.synopsis && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.synopsis}</div>}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#7c3aed",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {isEditMode ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3d3d5a",
                color: "#e0e0f8",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerMovieFormModal;
