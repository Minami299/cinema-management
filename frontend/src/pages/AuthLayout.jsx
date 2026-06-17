import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <Outlet />
        <div className="auth-links">
          <Link to="/login">Đăng nhập</Link>
          <Link to="/register">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
