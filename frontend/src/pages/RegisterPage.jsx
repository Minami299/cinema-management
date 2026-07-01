import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading, register } = useAuth();

  const getRedirectPath = (targetUser) => {
    const roleName = String(
      targetUser?.role && typeof targetUser.role === "object"
        ? targetUser.role.name
        : targetUser?.role || "",
    ).toUpperCase();

    switch (roleName) {
      case "ADMIN":
        return "/admin/dashboard";
      case "MANAGER":
        return "/manager/dashboard";
      case "STAFF":
        return "/staff/dashboard";
      case "CUSTOMER":
        return "/profile";
      default:
        return "/";
    }
  };

  useEffect(() => {
    if (!loading && user) {
      navigate(getRedirectPath(user), { replace: true });
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await register({ name, email, password, phone });
      const redirectPath = getRedirectPath(response.data?.data?.user || {});
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Đăng ký</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Tên
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Số điện thoại
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Không bắt buộc"
          />
        </label>
        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
