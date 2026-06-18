import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const ROLE_MAPPER = {
  "65f1a2b3c4d5e6f7a8b90101": { name: "Quản trị viên", color: "#ef4444", bg: "#fef2f2" },
  "65f1a2b3c4d5e6f7a8b90102": { name: "Quản lý rạp", color: "#f59e0b", bg: "#fffbeb" },
  "65f1a2b3c4d5e6f7a8b90103": { name: "Nhân viên rạp", color: "#10b981", bg: "#f0fdf4" },
  "65f1a2b3c4d5e6f7a8b90104": { name: "Khách hàng", color: "#3b82f6", bg: "#eff6ff" }
};

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth(); 
  
  // Các State quản lý chế độ xem
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [displayUser, setDisplayUser] = useState({
    _id: "", name: "", email: "", phone: "", role: ""
  });

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  
  // State quản lý Form Đổi Mật Khẩu
  const [passwordData, setPasswordData] = useState({
    oldPassword: "", newPassword: "", confirmPassword: ""
  });

  // State lưu trữ lỗi Validate
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      const userRoleId = user.role?._id || user.role || "";
      const initialData = {
        _id: user._id || user.id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: userRoleId
      };
      setDisplayUser(initialData);
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone
      });
    }
  }, [user]);

  // Handle thay đổi input Hồ sơ
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi ngay khi người dùng bắt đầu gõ lại
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle thay đổi input Mật khẩu
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 1. HÀM VALIDATE HỒ SƠ
  const validateProfile = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống!";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống!";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Định dạng email không hợp lệ!";
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/; // Định dạng số ĐT Việt Nam
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại gồm 10 số và bắt đầu bằng 03, 05, 07, 08, 09!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 2. HÀM VALIDATE MẬT KHẨU
  const validatePassword = () => {
    let newErrors = {};
    if (!passwordData.oldPassword) newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ!";
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới!";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự!";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // XỬ LÝ GỌI API LƯU HỒ SƠ
  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token"); 
      const response = await fetch(`http://localhost:9999/api/users/${displayUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Có lỗi xảy ra!");

      const updatedUser = result.data;
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Giữ phiên đăng nhập

      const updatedRoleId = updatedUser.role?._id || updatedUser.role || "";
      setDisplayUser({
        _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, role: updatedRoleId
      });

      if (typeof updateUser === "function") updateUser(updatedUser);

      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    }
  };

  // XỬ LÝ GỌI API ĐỔI MẬT KHẨU
  const handleSavePassword = async () => {
    if (!validatePassword()) return;

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token"); 
      const response = await fetch(`http://localhost:9999/api/users/${displayUser._id}/password`, {
        method: "PATCH", // API update password của bạn dùng method PATCH
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Đổi mật khẩu thất bại!");

      alert("Đổi mật khẩu thành công!");
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancelProfile = () => {
    setFormData({ name: displayUser.name, email: displayUser.email, phone: displayUser.phone });
    setErrors({});
    setIsEditing(false);
  };

  const handleCancelPassword = () => {
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    setIsChangingPassword(false);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) logout();
  };

  const userRoleConfig = ROLE_MAPPER[displayUser.role] || { name: "Thành viên", color: "#4f46e5", bg: "#e0e7ff" };

  return (
    <div className="profile-container">
      <style>{`
        :root {
          --primary-color: #4f46e5; --primary-hover: #4338ca;
          --danger-color: #ef4444; --danger-hover: #dc2626;
          --success-color: #10b981; --success-hover: #059669;
          --warning-color: #f59e0b; --warning-hover: #d97706;
          --text-main: #1f2937; --text-muted: #6b7280;
          --bg-page: #f3f4f6; --bg-card: #ffffff; --border-color: #e5e7eb;
        }

        .profile-container { display: flex; justify-content: center; align-items: center; min-height: 85vh; background-color: var(--bg-page); padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
        .profile-card { background: var(--bg-card); border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); width: 100%; max-width: 440px; overflow: hidden; }
        .profile-header { display: flex; flex-direction: column; align-items: center; padding: 32px 24px 20px 24px; border-bottom: 1px solid var(--border-color); background: linear-gradient(to bottom, #f9fafb, var(--bg-card)); }
        .avatar-placeholder { width: 80px; height: 80px; background-color: ${userRoleConfig.color}; color: white; font-size: 32px; font-weight: bold; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
        .profile-header h2 { margin: 0 0 8px 0; color: var(--text-main); font-size: 24px; font-weight: 700; }
        .badge { background-color: ${userRoleConfig.bg}; color: ${userRoleConfig.color}; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; }
        .profile-body { padding: 24px; }
        .info-group { margin-bottom: 18px; }
        .info-group label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }
        .info-group p { margin: 0; font-size: 15px; color: var(--text-main); font-weight: 500; padding: 10px 14px; background-color: #f9fafb; border: 1px solid var(--border-color); border-radius: 8px; min-height: 20px; }
        .info-group input { width: 100%; box-sizing: border-box; font-size: 15px; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-main); font-weight: 500; outline: none; transition: all 0.2s; }
        .info-group input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); }
        .info-group input.input-error { border-color: var(--danger-color); }
        .info-group input.input-error:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15); }
        .error-text { color: var(--danger-color); font-size: 12px; margin-top: 6px; display: block; font-weight: 500; }
        
        .profile-footer { padding: 0 24px 32px 24px; display: flex; flex-direction: column; gap: 12px; }
        .btn-group { display: flex; gap: 10px; width: 100%; }
        .btn { display: flex; align-items: center; justify-content: center; gap: 8px; flex: 1; padding: 11px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background-color 0.2s, transform 0.1s; }
        .btn:active { transform: scale(0.98); }
        .btn-edit { background-color: var(--primary-color); color: white; }
        .btn-edit:hover { background-color: var(--primary-hover); }
        .btn-save { background-color: var(--success-color); color: white; }
        .btn-save:hover { background-color: var(--success-hover); }
        .btn-cancel { background-color: #e5e7eb; color: var(--text-main); }
        .btn-cancel:hover { background-color: #d1d5db; }
        .btn-password { background-color: var(--warning-color); color: white; }
        .btn-password:hover { background-color: var(--warning-hover); }
        .btn-logout { background-color: transparent; color: var(--danger-color); border: 1px solid var(--danger-color); padding: 10px; }
        .btn-logout:hover { background-color: var(--danger-color); color: white; }
      `}</style>

      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-placeholder">
            {displayUser.name ? displayUser.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2>{isChangingPassword ? "Đổi mật khẩu" : "Hồ sơ cá nhân"}</h2>
          <span className="badge">{userRoleConfig.name}</span>
        </div>

        <div className="profile-body">
          {isChangingPassword ? (
            /* GIAO DIỆN FORM ĐỔI MẬT KHẨU */
            <>
              <div className="info-group">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password" name="oldPassword"
                  value={passwordData.oldPassword} onChange={handlePasswordChange}
                  className={errors.oldPassword ? "input-error" : ""}
                  placeholder="Nhập mật khẩu hiện tại"
                />
                {errors.oldPassword && <span className="error-text">{errors.oldPassword}</span>}
              </div>
              <div className="info-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password" name="newPassword"
                  value={passwordData.newPassword} onChange={handlePasswordChange}
                  className={errors.newPassword ? "input-error" : ""}
                  placeholder="Nhập mật khẩu mới (Ít nhất 6 ký tự)"
                />
                {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
              </div>
              <div className="info-group">
                <label>Xác nhận mật khẩu mới</label>
                <input
                  type="password" name="confirmPassword"
                  value={passwordData.confirmPassword} onChange={handlePasswordChange}
                  className={errors.confirmPassword ? "input-error" : ""}
                  placeholder="Nhập lại mật khẩu mới"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </>
          ) : (
            /* GIAO DIỆN HỒ SƠ THÔNG THƯỜNG */
            <>
              <div className="info-group">
                <label>Tên người dùng</label>
                {isEditing ? (
                  <>
                    <input
                      type="text" name="name"
                      value={formData.name} onChange={handleInputChange}
                      className={errors.name ? "input-error" : ""}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </>
                ) : (
                  <p>{displayUser.name || "Chưa cập nhật"}</p>
                )}
              </div>
              <div className="info-group">
                <label>Địa chỉ Email</label>
                {isEditing ? (
                  <>
                    <input
                      type="email" name="email"
                      value={formData.email} onChange={handleInputChange}
                      className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </>
                ) : (
                  <p>{displayUser.email || "Chưa cập nhật"}</p>
                )}
              </div>
              <div className="info-group">
                <label>Số điện thoại</label>
                {isEditing ? (
                  <>
                    <input
                      type="text" name="phone"
                      value={formData.phone} onChange={handleInputChange}
                      className={errors.phone ? "input-error" : ""}
                      placeholder="Ví dụ: 0987654321"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </>
                ) : (
                  <p>{displayUser.phone || "Chưa cập nhật"}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="profile-footer">
          {/* LOGIC HIỂN THỊ NÚT BẤM THEO STATE */}
          {isChangingPassword ? (
             <div className="btn-group">
               <button className="btn btn-cancel" onClick={handleCancelPassword}>Hủy bỏ</button>
               <button className="btn btn-save" onClick={handleSavePassword}>Lưu mật khẩu</button>
             </div>
          ) : isEditing ? (
            <div className="btn-group">
              <button className="btn btn-cancel" onClick={handleCancelProfile}>Hủy bỏ</button>
              <button className="btn btn-save" onClick={handleSaveProfile}>Lưu thay đổi</button>
            </div>
          ) : (
            <div className="btn-group">
              <button className="btn btn-edit" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
              <button className="btn btn-password" onClick={() => setIsChangingPassword(true)}>
                Đổi mật khẩu
              </button>
            </div>
          )}
          
          <button className="btn btn-logout" onClick={handleLogout} style={{ marginTop: "8px" }}>
            Đăng xuất tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;