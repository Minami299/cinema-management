import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../services/axiosClient";
import "./LoginPage.css";

/* ── SVG icon helpers ── */
const IconFilm = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
);

const IconCheck = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconMail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconLock = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconArrowRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconKey = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const AuthLeft = () => (
  <div className="auth-left">
    <img
      className="auth-left-bg"
      src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=900&q=80"
      alt="Cinema lobby"
    />
    <div className="auth-left-overlay" />
    <div className="auth-left-content">
      <a href="/" className="auth-logo">
        <span className="auth-logo-icon">
          <IconFilm />
        </span>
        <span className="auth-logo-text">CinemaHub</span>
      </a>
      <div className="auth-hero">
        <h2>Forgot Password?</h2>
        <p>
          Don't worry! We will help you reset it using a secure OTP code sent to your email.
        </p>
        <ul className="auth-features">
          {[
            "Secure password recovery using OTP",
            "Easy 2-step verification process",
            "Instant password updates",
          ].map((f) => (
            <li key={f}>
              <span className="feat-check">
                <IconCheck />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="auth-footer">© 2026 CinemaHub. All rights reserved.</div>
    </div>
  </div>
);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const response = await axiosClient.post("/auth/forgot-password", { email });
      if (response.data && response.data.success) {
        setMessage(response.data.message || "Mã OTP đã được gửi.");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Yêu cầu gửi OTP thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const response = await axiosClient.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (response.data && response.data.success) {
        alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <AuthLeft />

      <div className="auth-right">
        {step === 1 ? (
          <>
            <div className="auth-form-header">
              <h1>Forgot Password</h1>
              <p>Enter your email to receive a password reset OTP code</p>
            </div>

            <form className="auth-form" onSubmit={handleRequestOtp}>
              {/* Email */}
              <div className="form-field">
                <label htmlFor="forgot-email">Email Address</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">
                    <IconMail />
                  </span>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success" style={{ color: "#4ade80", marginBottom: "15px", fontSize: "0.875rem" }}>{message}</div>}

              <button type="submit" className="auth-submit-btn" disabled={submitting}>
                {submitting ? "Sending OTP…" : "Send OTP"}
                {!submitting && <IconArrowRight />}
              </button>

              <div className="auth-bottom-link">
                Remember your password?{" "}
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                >
                  Sign In
                </a>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="auth-form-header">
              <h1>Reset Password</h1>
              <p>Enter the 6-digit OTP code and your new password</p>
            </div>

            <form className="auth-form" onSubmit={handleResetPassword}>
              {/* OTP */}
              <div className="form-field">
                <label htmlFor="otp-code">Verification Code (OTP)</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">
                    <IconKey />
                  </span>
                  <input
                    id="otp-code"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="form-field">
                <label htmlFor="new-password">New Password</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">
                    <IconLock />
                  </span>
                  <input
                    id="new-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">
                    <IconLock />
                  </span>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <div className="auth-error">{error}</div>}
              {message && <div className="auth-success" style={{ color: "#4ade80", marginBottom: "15px", fontSize: "0.875rem" }}>{message}</div>}

              <button type="submit" className="auth-submit-btn" disabled={submitting}>
                {submitting ? "Resetting password…" : "Reset Password"}
                {!submitting && <IconArrowRight />}
              </button>

              <div className="auth-bottom-link">
                Didn't receive the code?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep(1);
                    setError("");
                    setMessage("");
                  }}
                >
                  Send again
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
