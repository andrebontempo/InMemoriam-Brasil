const mongoose = require("mongoose")

const MemorialSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  conteudo: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
})

const Memorial = mongoose.model("Memorial", MemorialSchema)

module.exports = Memorial
