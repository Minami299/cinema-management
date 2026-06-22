const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["ADMIN", "MANAGER", "STAFF", "CUSTOMER"],
    },
    description: { type: String },
    permissions: [{ type: String }], // Danh sách các mã quyền, ví dụ: 'CREATE_MOVIE', 'BOOK_TICKET'
  },
  { timestamps: true },
);

module.exports = mongoose.model("Role", RoleSchema);
