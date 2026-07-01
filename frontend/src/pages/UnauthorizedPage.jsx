import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./UnauthorizedPage.css";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="unauthorized-root">
      <div className="unauthorized-glow-bg"></div>
      <div className="unauthorized-card">
        <div className="unauthorized-code-badge">403</div>
        <h1 className="unauthorized-title">Truy cập bị từ chối</h1>
        <p className="unauthorized-desc">
          Tài khoản của bạn không có quyền truy cập vào trang này.
          {user && (
            <>
              {" "}
              Role hiện tại:{" "}
              <span className="unauthorized-role-tag">
                {typeof user.role === "object" ? user.role.name : user.role}
              </span>
            </>
          )}
        </p>
        <div className="unauthorized-actions">
          <button
            className="unauthorized-btn-back"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
          <button
            className="unauthorized-btn-home"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
