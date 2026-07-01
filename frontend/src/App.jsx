import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AuthLayout from "./pages/AuthLayout";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Auth routes */}
          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<LoginPage />} />
          </Route>
          <Route path="/register" element={<AuthLayout />}>
            <Route index element={<RegisterPage />} />
          </Route>

          {/* Dashboard router: tự redirect theo role */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* Profile: tất cả user đã đăng nhập */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* ADMIN dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          {/* MANAGER dashboard */}
          <Route
            path="/manager/dashboard"
            element={
              <RoleRoute allowedRoles={["MANAGER", "ADMIN"]}>
                <ManagerDashboard />
              </RoleRoute>
            }
          />

          {/* STAFF dashboard */}
          <Route
            path="/staff/dashboard"
            element={
              <RoleRoute allowedRoles={["STAFF", "MANAGER", "ADMIN"]}>
                <StaffDashboard />
              </RoleRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
