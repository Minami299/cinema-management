const mongoose = require("mongoose");

const CinemaSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true }, // Hà Nội, TP.HCM,...
    phone: { type: String },
    status: {
      type: String,
      enum: ["Active", "Maintenance"],
      default: "Active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cinema", CinemaSchema);
