const mongoose = require("mongoose")

const GallerySchema = new mongoose.Schema({
  memorial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Memorial",
    required: true,
  },
  photos: [{ type: String }],
  videos: [{ type: String }],
  audios: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Gallery", GallerySchema)
