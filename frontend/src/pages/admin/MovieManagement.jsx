import { useEffect, useState } from "react";
import MovieTable from "../../components/admin/movies/MovieTable";
import MovieFormModal from "../../components/admin/movies/MovieFormModal";
import DeleteMovieModal from "../../components/admin/movies/DeleteMovieModal";
import movieService from "../../services/movieService";

const normalizeMovieList = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.movies)) return responseData.movies;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
};

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.movies.getAll();
      setMovies(normalizeMovieList(response.data));
    } catch (error) {
      console.error("MovieManagement loadMovies error:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleOpenCreate = () => {
    setSelectedMovie(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setSelectedMovie(movie);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedMovie(null);
  };

  const handleSubmitMovie = async (payload) => {
    try {
      if (selectedMovie?._id) {
        await movieService.movies.update(selectedMovie._id, payload);
      } else {
        await movieService.movies.create(payload);
      }

      handleCloseForm();
      await loadMovies();
    } catch (error) {
      console.error("MovieManagement submitMovie error:", error);
    }
  };

  const handleDeleteRequest = (movie) => {
    setDeleteTarget(movie);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?._id) return;

    try {
      await movieService.movies.delete(deleteTarget._id);
      setDeleteTarget(null);
      await loadMovies();
    } catch (error) {
      console.error("MovieManagement deleteMovie error:", error);
    }
  };

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-section-title">Danh sách phim</div>

        <div className="admin-button-row">
          <button className="admin-btn primary" onClick={handleOpenCreate}>
            Add Movie
          </button>
        </div>
      </div>

      {loading && <div className="admin-loading">Đang tải dữ liệu...</div>}

      <MovieTable
        movies={movies}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteRequest}
      />

      <MovieFormModal
        isOpen={isFormOpen}
        movie={selectedMovie}
        onClose={handleCloseForm}
        onSubmit={handleSubmitMovie}
      />

      <DeleteMovieModal
        isOpen={Boolean(deleteTarget)}
        movie={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default MovieManagement;
