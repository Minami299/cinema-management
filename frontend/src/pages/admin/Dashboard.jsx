import { useCallback, useEffect, useState } from "react";
import movieService from "../../services/movieService";

const ROLE_COLORS = {
  ADMIN: "#dc2626",
  MANAGER: "#7c3aed",
  STAFF: "#2563eb",
  CUSTOMER: "#059669",
};

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [movieRes, userRes] = await Promise.all([
        movieService.movies.getAll(),
        movieService.users.getAll(),
      ]);
      console.log("USER API:", userRes.data);

      if (Array.isArray(movieRes.data)) {
        setMovies(movieRes.data);
      } else if (Array.isArray(movieRes.data?.movies)) {
        setMovies(movieRes.data.movies);
      } else if (Array.isArray(movieRes.data?.data)) {
        setMovies(movieRes.data.data);
      } else {
        setMovies([]);
      }

      if (Array.isArray(userRes.data)) {
        setUsers(userRes.data);
      } else if (Array.isArray(userRes.data?.users)) {
        setUsers(userRes.data.users);
      } else if (Array.isArray(userRes.data?.data)) {
        setUsers(userRes.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      setMovies([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <>
      {loading && <div className="admin-loading">Đang tải dữ liệu...</div>}

      <div className="admin-content-inner">
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div
              className="admin-stat-icon"
              style={{
                background: "#6366f122",
                color: "#6366f1",
              }}
            >
              👤
            </div>

            <div className="admin-stat-info">
              <div className="admin-stat-value">{users.length}</div>
              <div className="admin-stat-label">Tổng người dùng</div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div
              className="admin-stat-icon"
              style={{
                background: "#e5091422",
                color: "#e50914",
              }}
            >
              🎬
            </div>

            <div className="admin-stat-info">
              <div className="admin-stat-value">{movies.length}</div>
              <div className="admin-stat-label">Tổng phim</div>
            </div>
          </div>
        </div>

        <div className="admin-section-title">Người dùng mới</div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Role</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {users.slice(0, 5).map((u) => {
                const safeUser = u || {};
                const role =
                  typeof safeUser.role === "object" && safeUser.role
                    ? safeUser.role.name
                    : safeUser.role || "CUSTOMER";

                return (
                  <tr key={safeUser._id || safeUser.email || Math.random()}>
                    <td>
                      <div className="admin-table-user">
                        <div className="admin-table-avatar">
                          {safeUser.name?.charAt(0) || "-"}
                        </div>

                        {safeUser.name || "-"}
                      </div>
                    </td>

                    <td>{safeUser.email || "-"}</td>

                    <td>
                      <span
                        className="admin-table-role-tag"
                        style={{
                          background: `${ROLE_COLORS[role] || "#ccc"}22`,
                          color: ROLE_COLORS[role] || "#333",
                        }}
                      >
                        {role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-table-status ${
                          safeUser.isActive ? "active" : "inactive"
                        }`}
                      >
                        {safeUser.isActive ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td colSpan={4}>Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-section-title">Phim mới cập nhật</div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên phim</th>
                <th>Thể loại</th>
                <th>Thời lượng</th>
              </tr>
            </thead>

            <tbody>
              {movies.slice(0, 5).map((movie) => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>

                  <td>
                    {Array.isArray(movie.genre)
                      ? movie.genre.join(", ")
                      : movie.genre}
                  </td>

                  <td>{movie.duration} phút</td>
                </tr>
              ))}

              {movies.length === 0 && (
                <tr>
                  <td colSpan={3}>Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
