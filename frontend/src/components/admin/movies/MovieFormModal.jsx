import { useEffect, useMemo, useState } from "react";

const initialForm = {
  posterUrl: "",
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

const isValidUrl = (value) => {
  if (!value) return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const MovieFormModal = ({ isOpen, movie, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditMode = useMemo(() => Boolean(movie?._id), [movie]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      posterUrl: movie?.posterUrl || "",
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

    if (!formData.posterUrl.trim())
      nextErrors.posterUrl = "Poster URL is required";
    if (!formData.title.trim()) nextErrors.title = "Title is required";
    if (!formData.synopsis.trim()) nextErrors.synopsis = "Synopsis is required";
    if (!formData.genre.trim()) nextErrors.genre = "Genre is required";
    if (!formData.duration || Number(formData.duration) <= 0)
      nextErrors.duration = "Duration must be greater than 0";
    if (!formData.director.trim()) nextErrors.director = "Director is required";
    if (!formData.cast.trim()) nextErrors.cast = "Cast is required";
    if (!formData.trailerUrl.trim())
      nextErrors.trailerUrl = "Trailer URL is required";
    if (!formData.movieLanguage.trim())
      nextErrors.movieLanguage = "Language is required";
    if (!formData.ageRating.trim())
      nextErrors.ageRating = "Age rating is required";
    if (!formData.releaseDate)
      nextErrors.releaseDate = "Release date is required";
    if (!formData.status.trim()) nextErrors.status = "Status is required";

    if (formData.posterUrl && !isValidUrl(formData.posterUrl))
      nextErrors.posterUrl = "Poster URL must be valid";
    if (formData.trailerUrl && !isValidUrl(formData.trailerUrl))
      nextErrors.trailerUrl = "Trailer URL must be valid";

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
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            {isEditMode ? "Edit Movie" : "Add Movie"}
          </div>

          <button className="admin-btn secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="admin-modal-body" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-field full">
              <label htmlFor="posterUrl">Poster URL</label>
              <input
                id="posterUrl"
                name="posterUrl"
                className="admin-input"
                value={formData.posterUrl}
                onChange={handleChange}
              />
              {errors.posterUrl && (
                <div className="admin-form-error">{errors.posterUrl}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                className="admin-input"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && (
                <div className="admin-form-error">{errors.title}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="status">Status</label>
              <input
                id="status"
                name="status"
                className="admin-input"
                value={formData.status}
                onChange={handleChange}
              />
              {errors.status && (
                <div className="admin-form-error">{errors.status}</div>
              )}
            </div>

            <div className="admin-field full">
              <label htmlFor="synopsis">Synopsis</label>
              <textarea
                id="synopsis"
                name="synopsis"
                className="admin-textarea"
                value={formData.synopsis}
                onChange={handleChange}
              />
              {errors.synopsis && (
                <div className="admin-form-error">{errors.synopsis}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="genre">Genre</label>
              <input
                id="genre"
                name="genre"
                className="admin-input"
                value={formData.genre}
                onChange={handleChange}
              />
              {errors.genre && (
                <div className="admin-form-error">{errors.genre}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="duration">Duration</label>
              <input
                id="duration"
                name="duration"
                type="number"
                className="admin-input"
                value={formData.duration}
                onChange={handleChange}
              />
              {errors.duration && (
                <div className="admin-form-error">{errors.duration}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="director">Director</label>
              <input
                id="director"
                name="director"
                className="admin-input"
                value={formData.director}
                onChange={handleChange}
              />
              {errors.director && (
                <div className="admin-form-error">{errors.director}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="cast">Cast</label>
              <input
                id="cast"
                name="cast"
                className="admin-input"
                value={formData.cast}
                onChange={handleChange}
              />
              {errors.cast && (
                <div className="admin-form-error">{errors.cast}</div>
              )}
            </div>

            <div className="admin-field full">
              <label htmlFor="trailerUrl">Trailer URL</label>
              <input
                id="trailerUrl"
                name="trailerUrl"
                className="admin-input"
                value={formData.trailerUrl}
                onChange={handleChange}
              />
              {errors.trailerUrl && (
                <div className="admin-form-error">{errors.trailerUrl}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="movieLanguage">Language</label>
              <input
                id="movieLanguage"
                name="movieLanguage"
                className="admin-input"
                value={formData.movieLanguage}
                onChange={handleChange}
              />
              {errors.movieLanguage && (
                <div className="admin-form-error">{errors.movieLanguage}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="ageRating">Age Rating</label>
              <input
                id="ageRating"
                name="ageRating"
                className="admin-input"
                value={formData.ageRating}
                onChange={handleChange}
              />
              {errors.ageRating && (
                <div className="admin-form-error">{errors.ageRating}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="releaseDate">Release Date</label>
              <input
                id="releaseDate"
                name="releaseDate"
                type="date"
                className="admin-input"
                value={formData.releaseDate}
                onChange={handleChange}
              />
              {errors.releaseDate && (
                <div className="admin-form-error">{errors.releaseDate}</div>
              )}
            </div>
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-btn secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn primary">
              {isEditMode ? "Save Changes" : "Create Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieFormModal;
