const SETTINGS_ITEMS = [
  {
    title: "Cấu hình hệ thống",
    description:
      "Quản lý thông tin rạp, định dạng hiển thị và trạng thái hoạt động tổng thể.",
    status: "Đang kích hoạt",
  },
  {
    title: "Bảo mật",
    description:
      "Giám sát quyền truy cập, phiên đăng nhập và chính sách mật khẩu người dùng.",
    status: "Bảo vệ",
  },
  {
    title: "Thông báo",
    description:
      "Điều khiển cảnh báo hệ thống, email, và các thông báo nội bộ cho quản trị.",
    status: "Sẵn sàng",
  },
];

const Settings = () => {
  return (
    <div className="admin-content-inner">
      <div className="admin-section-title">Cài đặt hệ thống</div>

      <div className="admin-role-card-grid">
        {SETTINGS_ITEMS.map((item) => (
          <div key={item.title} className="admin-setting-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="admin-toggle-badge">{item.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
