const ManagerShowtimeTable = ({ showtimes = [], movies = [], rooms = [], onEdit, onDelete, currentPage = 1, totalPages = 1, onPageChange }) => {
  const getMovieTitle = (showtime) => {
    if (showtime.movie?.title) return showtime.movie.title;
    const movie = movies.find((m) => m._id === showtime.movie || m._id === showtime.movieId);
    return movie?.title || showtime.movie || showtime.movieId || "-";
  };

  const getRoomName = (showtime) => {
    if (showtime.room?.name) return showtime.room.name;
    const room = rooms.find((r) => r._id === showtime.room || r._id === showtime.roomId);
    return room?.name || showtime.room || showtime.roomId || "-";
  };

  return (
    <div className="manager-table-wrap">
      <table className="manager-table">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Room</th>
            <th>Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Available Seats</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {showtimes.map((showtime) => (
            <tr key={showtime._id}>
              <td style={{ color: "#e0e0f8", fontWeight: 500 }}>{getMovieTitle(showtime)}</td>
              <td style={{ color: "#8888aa" }}>{getRoomName(showtime)}</td>
              <td style={{ color: "#8888aa" }}>
                {showtime.date ? new Date(showtime.date).toLocaleDateString("vi-VN") : "-"}
              </td>
              <td style={{ color: "#8888aa" }}>
                {showtime.startTime || "-"} - {showtime.endTime || "-"}
              </td>
              <td style={{ color: "#10b981" }}>{showtime.ticketPrice ? `${showtime.ticketPrice.toLocaleString()}đ` : "-"}</td>
              <td style={{ color: "#c0c0e0" }}>
                {(() => {
                  const booked = showtime.seatStatus ? showtime.seatStatus.filter((seat) => seat.status === "Booked").length : 0;
                  const total = showtime.seatStatus ? showtime.seatStatus.length : 0;
                  return total > 0 ? total - booked : 0;
                })()}
              </td>
              <td>
                <span style={{ padding: "4px 8px", borderRadius: 4, backgroundColor: showtime.seatStatus && showtime.seatStatus.every((seat) => seat.status === "Booked") ? "#dc262633" : "#7c3aed33", color: showtime.seatStatus && showtime.seatStatus.every((seat) => seat.status === "Booked") ? "#dc2626" : "#a78bfa", fontSize: 12 }}>
                  {showtime.seatStatus && showtime.seatStatus.every((seat) => seat.status === "Booked") ? "Hết chỗ" : "Mở bán"}
                </span>
              </td>
              <td>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => onEdit(showtime)}
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
                    onClick={() => onDelete(showtime)}
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

          {showtimes.length === 0 && (
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

export default ManagerShowtimeTable;
