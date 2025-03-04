const mongoose = require("mongoose")

const MemorialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Antes era `true`
  firstName: { type: String, required: false }, // Antes era `true`
  lastName: { type: String, required: false }, // Antes era `true`
  gender: { type: String, required: false }, // Antes era `true`
  relationship: { type: String, required: false }, // Antes era `true`
  birth: {
    date: { type: Date, required: false }, // Antes era `true`
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  death: {
    date: { type: Date, required: false }, // Antes era `true`
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  about: { type: String },
  tribute: [{ name: String, message: String }],
  lifeStory: { type: String },
  stories: [{ name: String, story: String }],
  theme: { type: String, default: "blue-theme" },
})

module.exports = mongoose.model("Memorial", MemorialSchema)
