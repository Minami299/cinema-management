const ROLE_COLORS = {
  ADMIN: "#dc2626",
  MANAGER: "#7c3aed",
  STAFF: "#2563eb",
  CUSTOMER: "#059669",
};

const UserTable = ({ users = [], onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const safeUser = user || {};
            const role =
              typeof safeUser.role === "object" && safeUser.role
                ? safeUser.role.name
                : safeUser.role || "CUSTOMER";
            const roleColor = ROLE_COLORS[role] || "#ccc";

            return (
              <tr key={safeUser._id || safeUser.email || Math.random()}>
                <td>
                  <div className="admin-table-avatar">
                    {safeUser.name?.charAt(0)?.toUpperCase() || "-"}
                  </div>
                </td>

                <td>{safeUser.name || "-"}</td>
                <td>{safeUser.email || "-"}</td>
                <td>{safeUser.phone || "-"}</td>

                <td>
                  <span
                    className="admin-table-role-tag"
                    style={{
                      background: `${roleColor}22`,
                      color: roleColor,
                    }}
                  >
                    {role}
                  </span>
                </td>

                <td>
                  <span
                    className={`admin-table-status ${safeUser.isActive ? "active" : "inactive"}`}
                  >
                    {safeUser.isActive ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>

                <td>
                  <div className="admin-button-row">
                    <button
                      className="admin-btn secondary"
                      onClick={() => onEdit(safeUser)}
                    >
                      Edit
                    </button>

                    <button
                      className="admin-btn secondary"
                      onClick={() => onToggleStatus(safeUser)}
                    >
                      {safeUser.isActive ? "Disable" : "Enable"}
                    </button>

                    <button
                      className="admin-btn danger"
                      onClick={() => onDelete(safeUser)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {users.length === 0 && (
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

export default UserTable;
