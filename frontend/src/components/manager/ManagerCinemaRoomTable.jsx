const ManagerCinemaRoomTable = ({ data = [], type = "cinema", cinemas = [], onEdit, onDelete }) => {
  const getCinemaName = (cinemaId) => {
    const cinema = cinemas.find((c) => c._id === cinemaId);
    return cinema?.name || cinemaId;
  };

  if (type === "cinema") {
    return (
      <div className="manager-table-wrap">
        <table className="manager-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((cinema) => (
              <tr key={cinema._id}>
                <td style={{ color: "#e0e0f8", fontWeight: 500 }}>{cinema.name}</td>
                <td style={{ color: "#8888aa" }}>{cinema.city}</td>
                <td style={{ color: "#8888aa" }}>{cinema.address}</td>
                <td style={{ color: "#8888aa" }}>{cinema.phone || "-"}</td>
                <td>
                  <span style={{ padding: "4px 8px", borderRadius: 4, backgroundColor: "#10b98133", color: "#6ee7b7", fontSize: 12 }}>
                    {cinema.status || "Active"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => onEdit(cinema, "cinema")}
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
                      onClick={() => onDelete(cinema, "cinema")}
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
            {data.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#8888aa", padding: "20px" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="manager-table-wrap">
      <table className="manager-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cinema</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((room) => (
            <tr key={room._id}>
              <td style={{ color: "#e0e0f8", fontWeight: 500 }}>{room.name}</td>
              <td style={{ color: "#8888aa" }}>{getCinemaName(room.cinemaId)}</td>
              <td style={{ color: "#8888aa" }}>{room.type || "Standard"}</td>
              <td style={{ color: "#c0c0e0" }}>{room.capacity || 0}</td>
              <td>
                <span style={{ padding: "4px 8px", borderRadius: 4, backgroundColor: "#10b98133", color: "#6ee7b7", fontSize: 12 }}>
                  {room.status || "Active"}
                </span>
              </td>
              <td>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => onEdit(room, "room")}
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
                    onClick={() => onDelete(room, "room")}
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
          {data.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#8888aa", padding: "20px" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerCinemaRoomTable;
