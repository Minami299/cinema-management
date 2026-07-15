const ManagerMovieTable = ({ movies = [], onEdit, onDelete, currentPage = 1, totalPages = 1, onPageChange }) => {
  return (
    <div className="manager-table-wrap">
      <table className="manager-table">
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
                <div style={{ width: 40, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
                    />
                  ) : (
                    <div style={{ color: "#fff", fontSize: 24 }}>🎬</div>
                  )}
                </div>
              </td>
              <td style={{ color: "#e0e0f8", fontWeight: 500 }}>{movie.title}</td>
              <td style={{ color: "#8888aa" }}>
                {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
              </td>
              <td style={{ color: "#8888aa" }}>{movie.duration} phút</td>
              <td style={{ color: "#8888aa" }}>
                {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString("vi-VN") : "-"}
              </td>
              <td>
                <span style={{ padding: "4px 8px", borderRadius: 4, backgroundColor: "#7c3aed33", color: "#a78bfa", fontSize: 12 }}>
                  {movie.status || "-"}
                </span>
              </td>
              <td>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => onEdit(movie)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#7c3aed",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(movie)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {movies.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "#8888aa", padding: "20px" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "20px", borderTop: "1px solid #333" }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "8px 12px",
              backgroundColor: currentPage === 1 ? "#444" : "#7c3aed",
              color: currentPage === 1 ? "#666" : "#fff",
              border: "none",
              borderRadius: 4,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: 12,
            }}
          >
            ← Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                padding: "8px 12px",
                backgroundColor: currentPage === page ? "#7c3aed" : "#333",
                color: currentPage === page ? "#fff" : "#8888aa",
                border: currentPage === page ? "1px solid #7c3aed" : "1px solid #444",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: currentPage === page ? "bold" : "normal",
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 12px",
              backgroundColor: currentPage === totalPages ? "#444" : "#7c3aed",
              color: currentPage === totalPages ? "#666" : "#fff",
              border: "none",
              borderRadius: 4,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: 12,
            }}
          >
            Sau →
          </button>

          <span style={{ color: "#8888aa", fontSize: 12, marginLeft: 12 }}>
            Trang {currentPage} / {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default ManagerMovieTable;
