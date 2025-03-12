const mongoose = require("mongoose")

const MemorialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  firstName: { type: String, required: true }, // Obrigatório
  lastName: { type: String, required: true }, // Obrigatório
  slug: { type: String, unique: true, required: true }, // Campo slug único e obrigatório
  gender: { type: String, required: false },
  relationship: { type: String, required: false },

  birth: {
    date: { type: Date, required: false },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },

  death: {
    date: { type: Date, required: false },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },

  epitaph: { type: String, maxlength: 255 }, // Novo campo Epitáfio
  about: { type: String },
  tribute: [{ name: String, message: String }],
  lifeStory: { type: String },
  stories: [{ name: String, story: String }],

  gallery: [
    {
      type: { type: String, enum: ["image", "audio", "video"], required: true },
      url: { type: String, required: true }, // Caminho do arquivo
      description: { type: String }, // Descrição opcional
    },
  ],

  theme: { type: String, default: "blue-theme" },
})

module.exports = mongoose.model("Memorial", MemorialSchema)
