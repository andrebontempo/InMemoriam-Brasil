const mongoose = require("mongoose")

const GallerySchema = new mongoose.Schema(
  {
    // Referência ao Memorial ao qual a galeria pertence (Obrigatório)
    memorial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Memorial",
      required: true,
    },

    // Referência ao usuário que enviou os arquivos (Obrigatório para rastreabilidade)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Lista de fotos enviadas (Opcional, padrão: [])
    photos: [{ type: String, default: [] }],

    // Lista de áudios enviados (Opcional, padrão: [])
    audios: [{ type: String, default: [] }],

    // Lista de vídeos enviados (Opcional, padrão: [])
    videos: [{ type: String, default: [] }],
  },
  { timestamps: true } // Adiciona automaticamente os campos createdAt e updatedAt
)

// Índice no MongoDB para melhorar a performance ao buscar galerias de um memorial
GallerySchema.index({ memorial: 1 })

module.exports = mongoose.model("Gallery", GallerySchema)
