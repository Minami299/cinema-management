import { useEffect, useMemo, useState } from "react";

const initialForm = {
  movieId: "",
  roomId: "",
  date: "",
  startTime: "",
  endTime: "",
  ticketPrice: "",
};

const ManagerShowtimeFormModal = ({ isOpen, showtime, movies, rooms, cinemas, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditMode = useMemo(() => Boolean(showtime?._id), [showtime]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      movieId: showtime?.movie?._id || showtime?.movieId || "",
      roomId: showtime?.room?._id || showtime?.roomId || "",
      date: showtime?.date ? showtime.date.slice(0, 10) : "",
      startTime: showtime?.startTime || "",
      endTime: showtime?.endTime || "",
      ticketPrice: showtime?.ticketPrice || "",
    });

    setErrors({});
  }, [isOpen, showtime]);

  if (!isOpen) return null;

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.movieId.trim()) nextErrors.movieId = "Movie is required";
    if (!formData.roomId.trim()) nextErrors.roomId = "Room is required";
    if (!formData.date.trim()) nextErrors.date = "Date is required";
    if (!formData.startTime.trim()) nextErrors.startTime = "Start time is required";
    if (!formData.endTime.trim()) nextErrors.endTime = "End time is required";
    if (!formData.ticketPrice || Number(formData.ticketPrice) <= 0)
      nextErrors.ticketPrice = "Ticket price must be greater than 0";

    if (formData.startTime && formData.endTime) {
      const start = formData.startTime;
      const end = formData.endTime;
      if (end <= start) {
        nextErrors.endTime = "End time must be after start time";
      }
    }

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

    const selectedRoom = rooms.find((room) => room._id === formData.roomId);
    const selectedCinema = selectedRoom?.cinema;
    const cinemaId = selectedCinema?._id || selectedCinema || showtime?.cinema?._id || showtime?.cinema || "";
    const payload = {
      movie: formData.movieId,
      room: formData.roomId,
      cinema: cinemaId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      ticketPrice: Number(formData.ticketPrice),
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
          maxWidth: 500,
          width: "90%",
          border: "1px solid #2d2d4a",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ color: "#e0e0f8", marginBottom: 4 }}>
            {isEditMode ? "Edit Showtime" : "Add Showtime"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Movie</label>
              <select
                name="movieId"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.movieId}
                onChange={handleChange}
              >
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
              {errors.movieId && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.movieId}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Room</label>
              <select
                name="roomId"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.roomId}
                onChange={handleChange}
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.name}
                  </option>
                ))}
              </select>
              {errors.roomId && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.roomId}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Date</label>
              <input
                name="date"
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
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.date}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Start Time</label>
              <input
                name="startTime"
                type="time"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.startTime}
                onChange={handleChange}
              />
              {errors.startTime && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.startTime}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>End Time</label>
              <input
                name="endTime"
                type="time"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                value={formData.endTime}
                onChange={handleChange}
              />
              {errors.endTime && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.endTime}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Ticket Price (VND)</label>
              <input
                name="ticketPrice"
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
                value={formData.ticketPrice}
                onChange={handleChange}
              />
              {errors.ticketPrice && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.ticketPrice}</div>}
            </div>

            <div>
              <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Cinema</label>
              <input
                name="cinemaName"
                type="text"
                disabled
                value={
                  (() => {
                    const currentRoom = rooms.find((room) => room._id === formData.roomId);
                    const cinemaId = currentRoom?.cinema?._id || currentRoom?.cinema;
                    return cinemas?.find((cinema) => cinema._id === cinemaId)?.name || "";
                  })()
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: "#2d2d4a",
                  border: "1px solid #3d3d5a",
                  borderRadius: 4,
                  color: "#e0e0f8",
                  boxSizing: "border-box",
                }}
                placeholder="Select a room to see cinema"
              />
            </div>
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

export default ManagerShowtimeFormModal;
