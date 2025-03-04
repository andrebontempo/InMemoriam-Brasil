const mongoose = require("mongoose")

const MemorialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  gender: {
    type: String,
    enum: ["Masculino", "Feminino", "Outro"],
    required: true,
  },
  relationship: { type: String, required: true },

  birth: {
    date: { type: Date, required: true },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  death: {
    date: { type: Date, required: true },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },

  about: { type: String },
  tribute: [
    { name: String, message: String, date: { type: Date, default: Date.now } },
  ],
  lifeStory: { type: String },
  stories: [
    { name: String, story: String, date: { type: Date, default: Date.now } },
  ],
  theme: { type: String, default: "default" },

  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Memorial", MemorialSchema)
