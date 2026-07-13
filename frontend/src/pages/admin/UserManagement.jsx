import { useEffect, useState } from "react";
import UserTable from "../../components/admin/users/UserTable";
import UserFormModal from "../../components/admin/users/UserFormModal";
import DeleteUserModal from "../../components/admin/users/DeleteUserModal";
import movieService from "../../services/movieService";

const normalizeUserList = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.users)) return responseData.users;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await movieService.users.getAll();
      setUsers(normalizeUserList(response.data));
    } catch (error) {
      console.error("UserManagement loadUsers error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleSubmitUser = async (payload) => {
    try {
      if (selectedUser?._id) {
        await movieService.users.update(selectedUser._id, payload);
      } else {
        await movieService.users.create(payload);
      }

      handleCloseForm();
      await loadUsers();
    } catch (error) {
      console.error("UserManagement submitUser error:", error);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const nextStatus = !user.isActive;
      await movieService.users.toggleStatus(user._id, nextStatus);
      await loadUsers();
    } catch (error) {
      console.error("UserManagement toggleStatus error:", error);
    }
  };

  const handleDeleteRequest = (user) => {
    setDeleteTarget(user);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?._id) return;

    try {
      await movieService.users.delete(deleteTarget._id);
      setDeleteTarget(null);
      await loadUsers();
    } catch (error) {
      console.error("UserManagement deleteUser error:", error);
    }
  };

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-section-title">Danh sách người dùng</div>

        <div className="admin-button-row">
          <button className="admin-btn primary" onClick={handleOpenCreate}>
            Add User
          </button>
        </div>
      </div>

      {loading && <div className="admin-loading">Đang tải dữ liệu...</div>}

      <UserTable
        users={users}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteRequest}
        onToggleStatus={handleToggleStatus}
      />

      <UserFormModal
        isOpen={isFormOpen}
        user={selectedUser}
        onClose={handleCloseForm}
        onSubmit={handleSubmitUser}
      />

      <DeleteUserModal
        isOpen={Boolean(deleteTarget)}
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default UserManagement;
