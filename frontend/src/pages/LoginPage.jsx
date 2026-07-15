import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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

const IconPhone = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12 19.79 19.79 0 0 1 1.21 3.59 2 2 0 0 1 3.19 1.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.46-.46a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z" />
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

const IconUser = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconEye = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
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

const IconGoogle = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      fill="#1877F2"
    />
  </svg>
);

/* ── Left panel (shared) ── */
const AuthLeft = () => (
  <div className="auth-left">
    {/* Replace src with your actual cinema background image */}
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
        <h2>Your seat awaits.</h2>
        <p>
          Book tickets, pick the perfect seat, and enjoy the magic of cinema —
          all in one place.
        </p>
        <ul className="auth-features">
          {[
            "Book tickets in under 60 seconds",
            "VIP seat selection with live map",
            "Exclusive member promotions & rewards",
            "Multiple payment methods supported",
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

/* ── Sign In form ── */
const SignInForm = ({ onSwitchTab }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();

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
        return "/";
      default:
        return "/";
    }
  };

  useEffect(() => {
    if (!loading && user) {
      navigate(getRedirectPath(user), { replace: true });
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await login({ email, password });
      const redirectPath = getRedirectPath(response.data?.data?.user || {});
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="auth-form-header">
        <h1>Welcome back</h1>
        <p>Sign in to your CinemaHub account</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-field">
          <label htmlFor="signin-email">Email Address</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <IconMail />
            </span>
            <input
              id="signin-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-field">
          <div className="form-field-row">
            <label htmlFor="signin-password">Password</label>
            <a href="/forgot-password" className="forgot-link">
              Forgot password?
            </a>
          </div>
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <IconLock />
            </span>
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="input-suffix"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="auth-checkbox-row">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me">Remember me for 30 days</label>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="auth-submit-btn" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign In"}
          {!submitting && <IconArrowRight />}
        </button>

        <div className="auth-divider">or continue with</div>

        <div className="auth-social-row">
          <button type="button" className="auth-social-btn">
            <IconGoogle /> Google
          </button>
          <button type="button" className="auth-social-btn">
            <IconFacebook /> Facebook
          </button>
        </div>

        <div className="auth-bottom-link">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchTab("register");
            }}
          >
            Sign up free
          </a>
        </div>
      </form>
    </>
  );
};

/* ── Create Account form ── */
const CreateAccountForm = ({ onSwitchTab }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await register({
        name: fullName,
        email,
        password,
        phone,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="auth-form-header">
        <h1>Create account</h1>
        <p>Join CinemaHub and start booking today</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-field">
          <label htmlFor="reg-name">Full Name</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <IconUser />
            </span>
            <input
              id="reg-name"
              type="text"
              placeholder="John Anderson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-field">
          <label htmlFor="reg-email">Email Address</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <IconMail />
            </span>
            <input
              id="reg-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="form-field">
          <label htmlFor="reg-phone">Phone Number</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <IconPhone />
            </span>
            <input
              id="reg-phone"
              type="tel"
              placeholder="0912 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-field">
          <label htmlFor="reg-password">Password</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <IconLock />
            </span>
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              className="input-suffix"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-field">
          <label htmlFor="reg-confirm">Confirm Password</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">
              <IconLock />
            </span>
            <input
              id="reg-confirm"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="input-suffix"
              onClick={() => setShowConfirmPassword((v) => !v)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="auth-checkbox-row">
          <input
            id="agree-terms"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="agree-terms">
            I agree to the <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>
          </label>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="auth-submit-btn" disabled={submitting}>
          {submitting ? "Creating account…" : "Create Account"}
          {!submitting && <IconArrowRight />}
        </button>

        <div className="auth-bottom-link">
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchTab("signin");
            }}
          >
            Sign in
          </a>
        </div>
      </form>
    </>
  );
};

/* ── Main page ── */
const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <div className="auth-wrapper">
      <AuthLeft />

      <div className="auth-right">
        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === "signin" ? "active" : ""}`}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Create Account
          </button>
        </div>

        {activeTab === "signin" ? (
          <SignInForm onSwitchTab={setActiveTab} />
        ) : (
          <CreateAccountForm onSwitchTab={setActiveTab} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
