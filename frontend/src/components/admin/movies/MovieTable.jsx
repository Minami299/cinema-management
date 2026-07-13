const MovieTable = ({ movies = [], onEdit, onDelete }) => {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Poster</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Duration</th>
            <th>Release Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              <td>
                <div className="admin-poster-cell">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="admin-poster-thumb"
                    />
                  ) : (
                    <div
                      className="admin-poster-thumb"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                      }}
                    >
                      🎬
                    </div>
                  )}
                </div>
              </td>

              <td>
                <div className="admin-movie-title">{movie.title}</div>
              </td>

              <td>
                {Array.isArray(movie.genre)
                  ? movie.genre.join(", ")
                  : movie.genre}
              </td>

              <td>{movie.duration} phút</td>

              <td>
                {movie.releaseDate
                  ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
                  : "-"}
              </td>

              <td>
                <span className="admin-pill">{movie.status || "-"}</span>
              </td>

              <td>
                <div className="admin-button-row">
                  <button
                    className="admin-btn secondary"
                    onClick={() => onEdit(movie)}
                  >
                    Edit
                  </button>

                  <button
                    className="admin-btn danger"
                    onClick={() => onDelete(movie)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {movies.length === 0 && (
            <tr>
              <td colSpan={7} className="admin-empty-state">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MovieTable;
