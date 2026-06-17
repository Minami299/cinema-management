import { useAuth } from "../contexts/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Chào mừng, {user?.name || "Người dùng"}!</p>
      <p>Vai trò của bạn là: {user?.role || "Chưa xác định"}</p>
    </div>
  );
};

export default DashboardPage;
