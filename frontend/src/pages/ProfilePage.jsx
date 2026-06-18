import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ROLE_MAPPER = {
  "65f1a2b3c4d5e6f7a8b90101": { name: "Quản trị viên", color: "#ef4444", bg: "#fef2f2" },
  "65f1a2b3c4d5e6f7a8b90102": { name: "Quản lý rạp", color: "#f59e0b", bg: "#fffbeb" },
  "65f1a2b3c4d5e6f7a8b90103": { name: "Nhân viên rạp", color: "#10b981", bg: "#f0fdf4" },
  "65f1a2b3c4d5e6f7a8b90104": { name: "Khách hàng", color: "#3b82f6", bg: "#eff6ff" }
};

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth(); 
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [displayUser, setDisplayUser] = useState({
    _id: "", name: "", email: "", phone: "", role: ""
  });

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "", newPassword: "", confirmPassword: ""
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateProfile = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống!";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống!";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Định dạng email không hợp lệ!";
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/; 
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại gồm 10 số và bắt đầu bằng 03, 05, 07, 08, 09!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      localStorage.setItem("user", JSON.stringify(updatedUser)); 

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

  const handleSavePassword = async () => {
    if (!validatePassword()) return;

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token"); 
      const response = await fetch(`http://localhost:9999/api/users/${displayUser._id}/password`, {
        method: "PATCH", 
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
          --bg-card: rgba(255, 255, 255, 0.95);
          --border-color: rgba(229, 231, 235, 0.5);
        }

        /* THÊM BACKGROUND RẠP PHIM */
        .profile-container {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          overflow-y: auto;
          display: flex; justify-content: center; align-items: center;
          padding: 20px;
          background: linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)),
                      url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
          font-family: system-ui, -apple-system, sans-serif;
          z-index: 1000;
        }
        
        /* HIỆU ỨNG KÍNH MỜ */
        .profile-card {
          position: relative;
          background: var(--bg-card);
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          width: 100%; max-width: 440px;
          margin: auto; /* Giữ form căn giữa khi màn hình nhỏ bị cuộn */
          overflow: hidden;
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-back {
          position: absolute; top: 16px; left: 16px;
          background: transparent; border: none;
          display: flex; align-items: center; gap: 6px;
          color: var(--text-muted); font-weight: 600; font-size: 14px;
          cursor: pointer; transition: color 0.2s;
          padding: 8px 12px; border-radius: 8px; z-index: 10;
        }
        .btn-back:hover { color: var(--primary-color); background-color: rgba(79, 70, 229, 0.05); }

        .profile-header {
          display: flex; flex-direction: column; align-items: center;
          padding: 40px 24px 20px 24px;
          border-bottom: 1px solid var(--border-color);
          background: transparent;
        }
        
        .avatar-placeholder {
          width: 80px; height: 80px;
          background-color: ${userRoleConfig.color}; color: white;
          font-size: 32px; font-weight: bold;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; margin-bottom: 16px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .profile-header h2 { margin: 0 0 8px 0; color: var(--text-main); font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .badge { background-color: ${userRoleConfig.bg}; color: ${userRoleConfig.color}; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; }
        
        .profile-body { padding: 24px 32px; }
        .info-group { margin-bottom: 18px; }
        .info-group label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }
        .info-group p { margin: 0; font-size: 15px; color: var(--text-main); font-weight: 500; padding: 12px 16px; background-color: rgba(249, 250, 251, 0.5); border: 1px solid var(--border-color); border-radius: 12px; min-height: 20px; }
        .info-group input { width: 100%; box-sizing: border-box; font-size: 15px; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-main); font-weight: 500; outline: none; transition: all 0.2s; background-color: #ffffff; }
        .info-group input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        .info-group input.input-error { border-color: var(--danger-color); }
        .info-group input.input-error:focus { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
        .error-text { color: var(--danger-color); font-size: 12px; margin-top: 6px; display: block; font-weight: 500; }
        
        .profile-footer { padding: 0 32px 32px 32px; display: flex; flex-direction: column; gap: 12px; }
        .btn-group { display: flex; gap: 10px; width: 100%; }
        .btn { display: flex; align-items: center; justify-content: center; gap: 8px; flex: 1; padding: 12px; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn:active { transform: translateY(1px); }
        .btn:hover { transform: translateY(-1px); }
        .btn-edit { background-color: var(--primary-color); color: white; }
        .btn-edit:hover { background-color: var(--primary-hover); }
        .btn-save { background-color: var(--success-color); color: white; }
        .btn-save:hover { background-color: var(--success-hover); }
        .btn-cancel { background-color: #e5e7eb; color: var(--text-main); }
        .btn-cancel:hover { background-color: #d1d5db; }
        .btn-password { background-color: var(--warning-color); color: white; }
        .btn-password:hover { background-color: var(--warning-hover); }
        
        .btn-logout { background-color: transparent; color: var(--danger-color); border: 1px solid rgba(239, 68, 68, 0.3); padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 4px; }
        .btn-logout:hover { background-color: var(--danger-color); color: white; border-color: var(--danger-color); }
      `}</style>

      <div className="profile-card">
        {/* Nút Back */}
        <button className="btn-back" onClick={() => navigate("/")} title="Quay lại trang chủ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Trang chủ
        </button>

        <div className="profile-header">
          <div className="avatar-placeholder">
            {displayUser.name ? displayUser.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2>{isChangingPassword ? "Đổi mật khẩu" : "Hồ sơ cá nhân"}</h2>
          <span className="badge">{userRoleConfig.name}</span>
        </div>

        <div className="profile-body">
          {isChangingPassword ? (
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
          
          <button className="btn btn-logout" onClick={handleLogout}>
            Đăng xuất tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;