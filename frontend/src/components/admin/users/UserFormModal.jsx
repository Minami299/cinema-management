import { useEffect, useMemo, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "CUSTOMER",
  isActive: true,
};

const UserFormModal = ({ isOpen, user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditMode = useMemo(() => Boolean(user?._id), [user]);

  useEffect(() => {
    if (!isOpen) return;

    const normalizedRole =
      typeof user?.role === "object" && user?.role !== null
        ? user.role.name
        : user?.role || "CUSTOMER";

    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      role: normalizedRole,
      isActive: user?.isActive ?? true,
    });

    setErrors({});
  }, [isOpen, user]);

  if (!isOpen) return null;

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    if (!formData.phone.trim()) nextErrors.phone = "Phone is required";
    if (!isEditMode && !formData.password.trim())
      nextErrors.password = "Password is required";
    if (!formData.role.trim()) nextErrors.role = "Role is required";

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : type === "checkbox"
            ? checked
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      ...formData,
      isActive: Boolean(formData.isActive),
    };

    await onSubmit(payload);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            {isEditMode ? "Edit User" : "Add User"}
          </div>

          <button className="admin-btn secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="admin-modal-body" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                className="admin-input"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="admin-form-error">{errors.name}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                className="admin-input"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="admin-form-error">{errors.email}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                className="admin-input"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <div className="admin-form-error">{errors.phone}</div>
              )}
            </div>

            {!isEditMode && (
              <div className="admin-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="admin-input"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="admin-form-error">{errors.password}</div>
                )}
              </div>
            )}

            <div className="admin-field">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                className="admin-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="STAFF">STAFF</option>
                <option value="CUSTOMER">CUSTOMER</option>
              </select>
              {errors.role && (
                <div className="admin-form-error">{errors.role}</div>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="isActive">Status</label>
              <select
                id="isActive"
                name="isActive"
                className="admin-select"
                value={formData.isActive ? "true" : "false"}
                onChange={handleChange}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-btn secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn primary">
              {isEditMode ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
