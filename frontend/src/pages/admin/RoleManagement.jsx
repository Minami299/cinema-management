const ROLE_DATA = [
  {
    name: "ADMIN",
    description:
      "Quản trị viên toàn hệ thống - Có toàn quyền cấu hình rạp, phim và phân quyền",
    permissions: [
      "CREATE_MOVIE",
      "EDIT_MOVIE",
      "DELETE_MOVIE",
      "MANAGE_USERS",
      "MANAGE_ROLES",
      "VIEW_REPORTS",
    ],
  },
  {
    name: "MANAGER",
    description:
      "Quản lý rạp - Quản lý suất chiếu, phòng chiếu và xem báo cáo doanh thu rạp",
    permissions: [
      "CREATE_SHOWTIME",
      "EDIT_SHOWTIME",
      "MANAGE_ROOMS",
      "VIEW_CINEMA_REPORTS",
    ],
  },
  {
    name: "STAFF",
    description:
      "Nhân viên rạp - Hỗ trợ khách hàng check-in vé, bán combo bắp nước trực tiếp tại quầy",
    permissions: ["CHECKIN_TICKET", "SELL_FOOD", "VIEW_SHOWTIME"],
  },
  {
    name: "CUSTOMER",
    description:
      "Khách hàng - Đặt vé trực tuyến, quản lý lịch sử đặt vé và danh sách phim yêu thích",
    permissions: ["BOOK_TICKET", "VIEW_MOVIE", "ADD_FAVORITE"],
  },
];

const RoleManagement = () => {
  return (
    <div className="admin-content-inner">
      <div className="admin-section-title">Danh sách vai trò</div>

      <div className="admin-role-card-grid">
        {ROLE_DATA.map((role) => (
          <div key={role.name} className="admin-role-card">
            <h3>{role.name}</h3>
            <p>{role.description}</p>

            <div className="admin-role-permissions">
              {role.permissions.map((permission) => (
                <span key={permission} className="admin-pill">
                  {permission}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleManagement;
