const DeleteUserModal = ({ isOpen, user, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">Delete User</div>
          <button className="admin-btn secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="admin-modal-body">
          <p>
            Are you sure you want to delete <strong>{user?.name}</strong>?
          </p>

          <div className="admin-modal-actions">
            <button className="admin-btn secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="admin-btn danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
