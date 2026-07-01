const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    title: { type: String, required: true },
    synopsis: { type: String },
    genre: [{ type: String }],
    duration: { type: Number, required: true },
    director: { type: String },
    cast: [{ type: String }],
    movieLanguage: { type: String, default: "Vietnamese" },
    ageRating: {
      type: String,
      enum: ["P", "K", "T13", "T16", "T18", "C18"],
      default: "P",
    },
    trailerUrl: { type: String },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    releaseDate: { type: Date },
    status: {
      type: String,
      enum: ["Now Showing", "Coming Soon", "End of Showing"],
      default: "Coming Soon",
    },
    posterUrl: { type: String },
    bannerUrl: { type: String },
  },
  { timestamps: true },
);

// BỔ SUNG CẤU HÌNH Ở ĐÂY:
// Thêm { language_override: "dummy" } để MongoDB không soi trường "language" của bạn nữa
MovieSchema.index(
  { title: "text", synopsis: "text" },
  { language_override: "dummy" },
);
MovieSchema.index({ status: 1, releaseDate: -1 });

module.exports = mongoose.model("Movie", MovieSchema);
