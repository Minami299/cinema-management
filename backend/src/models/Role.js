const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // ADMIN, STAFF, CUSTOMER, MANAGER
    description: { type: String },
    permissions: [{ type: String }], // Ví dụ: ['MANAGE_MOVIES', 'BOOK_TICKETS', 'VIEW_REPORTS']
  },
  { timestamps: true },
);

module.exports = mongoose.model("Role", RoleSchema);
