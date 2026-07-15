import { useEffect, useMemo, useState } from "react";

const cinemaInitialForm = {
  name: "",
  city: "",
  address: "",
  phone: "",
  status: "Active",
};

const roomInitialForm = {
  name: "",
  cinemaId: "",
  type: "Standard",
  capacity: "",
  status: "Active",
};

const ManagerCinemaRoomFormModal = ({
  isOpen,
  itemType,
  item,
  cinemas,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(
    itemType === "cinema" ? cinemaInitialForm : roomInitialForm
  );
  const [errors, setErrors] = useState({});

  const isEditMode = useMemo(() => Boolean(item?._id), [item]);

  useEffect(() => {
    if (!isOpen) return;

    if (itemType === "cinema") {
      setFormData({
        name: item?.name || "",
        city: item?.city || "",
        address: item?.address || "",
        phone: item?.phone || "",
        status: item?.status || "Active",
      });
    } else {
      setFormData({
        name: item?.name || "",
        cinemaId: item?.cinemaId || "",
        type: item?.type || "Standard",
        capacity: item?.capacity || "",
        status: item?.status || "Active",
      });
    }

    setErrors({});
  }, [isOpen, item, itemType]);

  if (!isOpen) return null;

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Name is required";

    if (itemType === "cinema") {
      if (!formData.city.trim()) nextErrors.city = "City is required";
      if (!formData.address.trim()) nextErrors.address = "Address is required";
    } else {
      if (!formData.cinemaId.trim()) nextErrors.cinemaId = "Cinema is required";
      if (!formData.capacity || Number(formData.capacity) <= 0)
        nextErrors.capacity = "Capacity must be greater than 0";
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const payload =
      itemType === "cinema"
        ? formData
        : {
            ...formData,
            capacity: Number(formData.capacity),
          };

    await onSubmit(payload);
  };

  const title =
    itemType === "cinema"
      ? isEditMode
        ? "Edit Cinema"
        : "Add Cinema"
      : isEditMode
        ? "Edit Room"
        : "Add Room";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1a1a2e",
          borderRadius: 8,
          padding: 24,
          maxWidth: 500,
          width: "90%",
          border: "1px solid #2d2d4a",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ color: "#e0e0f8", marginBottom: 4 }}>{title}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Name</label>
            <input
              name="name"
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "#2d2d4a",
                border: "1px solid #3d3d5a",
                borderRadius: 4,
                color: "#e0e0f8",
                boxSizing: "border-box",
              }}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
          </div>

          {itemType === "cinema" ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>City</label>
                  <input
                    name="city"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#2d2d4a",
                      border: "1px solid #3d3d5a",
                      borderRadius: 4,
                      color: "#e0e0f8",
                      boxSizing: "border-box",
                    }}
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.city}</div>}
                </div>

                <div>
                  <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Phone</label>
                  <input
                    name="phone"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#2d2d4a",
                      border: "1px solid #3d3d5a",
                      borderRadius: 4,
                      color: "#e0e0f8",
                      boxSizing: "border-box",
                    }}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Address</label>
                <input
                  name="address"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    backgroundColor: "#2d2d4a",
                    border: "1px solid #3d3d5a",
                    borderRadius: 4,
                    color: "#e0e0f8",
                    boxSizing: "border-box",
                  }}
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.address}</div>}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Status</label>
                <select
                  name="status"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    backgroundColor: "#2d2d4a",
                    border: "1px solid #3d3d5a",
                    borderRadius: 4,
                    color: "#e0e0f8",
                    boxSizing: "border-box",
                  }}
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Cinema</label>
                  <select
                    name="cinemaId"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#2d2d4a",
                      border: "1px solid #3d3d5a",
                      borderRadius: 4,
                      color: "#e0e0f8",
                      boxSizing: "border-box",
                    }}
                    value={formData.cinemaId}
                    onChange={handleChange}
                  >
                    <option value="">Select a cinema</option>
                    {cinemas.map((cinema) => (
                      <option key={cinema._id} value={cinema._id}>
                        {cinema.name}
                      </option>
                    ))}
                  </select>
                  {errors.cinemaId && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.cinemaId}</div>}
                </div>

                <div>
                  <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Type</label>
                  <select
                    name="type"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#2d2d4a",
                      border: "1px solid #3d3d5a",
                      borderRadius: 4,
                      color: "#e0e0f8",
                      boxSizing: "border-box",
                    }}
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Standard">Standard</option>
                    <option value="IMAX">IMAX</option>
                    <option value="4DX">4DX</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Capacity</label>
                  <input
                    name="capacity"
                    type="number"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#2d2d4a",
                      border: "1px solid #3d3d5a",
                      borderRadius: 4,
                      color: "#e0e0f8",
                      boxSizing: "border-box",
                    }}
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                  {errors.capacity && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.capacity}</div>}
                </div>

                <div>
                  <label style={{ color: "#c0c0e0", fontSize: 12, display: "block", marginBottom: 6 }}>Status</label>
                  <select
                    name="status"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#2d2d4a",
                      border: "1px solid #3d3d5a",
                      borderRadius: 4,
                      color: "#e0e0f8",
                      boxSizing: "border-box",
                    }}
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#7c3aed",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {isEditMode ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3d3d5a",
                color: "#e0e0f8",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerCinemaRoomFormModal;
