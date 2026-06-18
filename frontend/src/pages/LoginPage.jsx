import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // State quản lý lỗi validate
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(""); // Lỗi trả về từ server
  const navigate = useNavigate();
  const { login } = useAuth();

  // Hàm Validate form Đăng nhập
  const validateForm = () => {
    let newErrors = {};
    
    // Kiểm tra Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập địa chỉ email!";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Định dạng email không hợp lệ!";
    }

    // Kiểm tra Mật khẩu
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu!";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    // Nếu không vượt qua bước validate thì dừng lại luôn
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <style>{`
        :root {
          --primary-color: #4f46e5;
          --primary-hover: #4338ca;
          --danger-color: #ef4444;
          --text-main: #1f2937;
          --text-muted: #6b7280;
          --bg-card: rgba(255, 255, 255, 0.95);
          --border-color: #e5e7eb;
        }

        .auth-container {
          position: fixed !important;
          top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
          width: 100vw !important; height: 100vh !important;
          display: flex; justify-content: center; align-items: center;
          background: linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)),
                      url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
          font-family: system-ui, -apple-system, sans-serif;
          z-index: 99999 !important;
          margin: 0; padding: 0;
        }

        .auth-card {
          background: var(--bg-card); border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          width: 100%; max-width: 400px; padding: 48px 40px;
          backdrop-filter: blur(10px); animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-header h1 { margin: 0; color: var(--text-main); font-size: 28px; font-weight: 800; }
        .auth-header p { margin: 8px 0 0 0; color: var(--text-muted); font-size: 15px; }
        .auth-form .input-group { margin-bottom: 20px; }
        
        .auth-form label { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--text-main); margin-bottom: 8px; }
        .auth-form input { width: 100%; box-sizing: border-box; font-size: 15px; padding: 14px 16px; border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-main); outline: none; transition: all 0.2s; background-color: #ffffff; }
        .auth-form input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        
        /* CSS Class Lỗi Validate */
        .auth-form input.input-error { border-color: var(--danger-color); }
        .auth-form input.input-error:focus { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
        .error-text { color: var(--danger-color); font-size: 12px; margin-top: 6px; display: block; font-weight: 500; text-align: left; }

        .server-error { background-color: #fef2f2; color: var(--danger-color); padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 500; margin-bottom: 20px; text-align: center; border: 1px solid #fecaca; }
        .btn-submit { width: 100%; padding: 14px; background-color: var(--primary-color); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
        .btn-submit:hover:not(:disabled) { background-color: var(--primary-hover); transform: translateY(-1px); }
        .btn-submit:disabled { background-color: #a5b4fc; cursor: not-allowed; }
        .auth-footer { margin-top: 28px; text-align: center; font-size: 14px; color: var(--text-muted); }
        .auth-footer a { color: var(--primary-color); text-decoration: none; font-weight: 600; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <h1>Đăng nhập</h1>
          <p>Chào mừng bạn quay trở lại</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {serverError && <div className="server-error">{serverError}</div>}

          <div className="input-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Địa chỉ Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
              }}
              className={errors.email ? "input-error" : ""}
              placeholder="Nhập email của bạn"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
              }}
              className={errors.password ? "input-error" : ""}
              placeholder="Nhập mật khẩu"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Đăng nhập ngay"}
          </button>
        </form>

        <div className="auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;