import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AuthLayout from "./pages/AuthLayout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import FoodOrderPage from "./pages/FoodOrderPage";

// ================= ADMIN =================
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import MovieManagement from "./pages/admin/MovieManagement";
import UserManagement from "./pages/admin/UserManagement";
import RoleManagement from "./pages/admin/RoleManagement";
import Settings from "./pages/admin/Settings";

// ================= MANAGER =================
import ManagerDashboard from "./pages/manager/ManagerDashboard";

// ================= STAFF =================
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffTicketsPage from "./pages/staff/StaffTicketsPage";
import StaffFoodPage from "./pages/staff/StaffFoodPage";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/food-drink" element={<PrivateRoute><FoodOrderPage /></PrivateRoute>} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* ================= AUTH ================= */}
          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<LoginPage />} />
          </Route>

          <Route path="/register" element={<AuthLayout />}>
            <Route index element={<RegisterPage />} />
          </Route>

          <Route path="/forgot-password" element={<AuthLayout />}>
            <Route index element={<ForgotPasswordPage />} />
          </Route>

          {/* ================= REDIRECT DASHBOARD ================= */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* ================= PROFILE ================= */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="movies" element={<MovieManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* ================= MANAGER ================= */}
          <Route
            path="/manager/dashboard"
            element={
              <RoleRoute allowedRoles={["MANAGER", "ADMIN"]}>
                <ManagerDashboard />
              </RoleRoute>
            }
          />

          {/* ================= STAFF ================= */}
          <Route
            path="/staff/dashboard"
            element={
              <RoleRoute allowedRoles={["STAFF", "MANAGER", "ADMIN"]}>
                <StaffDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/staff/tickets"
            element={
              <RoleRoute allowedRoles={["STAFF", "MANAGER", "ADMIN"]}>
                <StaffTicketsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/staff/food"
            element={
              <RoleRoute allowedRoles={["STAFF", "MANAGER", "ADMIN"]}>
                <StaffFoodPage />
              </RoleRoute>
            }
          />

          {/* ================= 404 ================= */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
