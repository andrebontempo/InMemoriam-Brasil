const mongoose = require("mongoose")

const MemorialSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  relationship: { type: String, required: true },
  birth: {
    date: { type: Date },
    place: { type: String },
  },
  death: {
    date: { type: Date },
    place: { type: String },
  },
  about: { type: String },
  theme: { type: String, default: "blue-theme" },
  epitaph: { type: String },

  // História de vida com título opcional
  lifeStory: {
    title: { type: String, default: "" }, // Título opcional
    content: { type: String, default: "" }, // Conteúdo opcional
  },

  // Histórias com título opcional e conteúdo opcional
  stories: [
    {
      title: { type: String, default: "" }, // Título opcional
      content: { type: String, default: "" }, // Conteúdo opcional
    },
  ],

  // Galeria separada por categorias
  gallery: {
    photos: [{ type: String }], // URLs das imagens
    audios: [{ type: String }], // URLs dos áudios
    videos: [{ type: String }], // URLs dos vídeos
  },
})

const Memorial = mongoose.model("Memorial", MemorialSchema)

module.exports = Memorial
