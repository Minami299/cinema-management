import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Hồ sơ</h1>
      <div className="profile-card">
        <div>
          <strong>Tên:</strong> {user?.name}
        </div>
        <div>
          <strong>Email:</strong> {user?.email}
        </div>
        <div>
          <strong>Vai trò:</strong> {user?.role}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
