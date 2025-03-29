const mongoose = require("mongoose")

const LifeStorySchema = new mongoose.Schema(
  {
    // Referência ao Memorial ao qual esta história pertence (Obrigatório)
    memorial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Memorial",
      required: true,
    },

    // Referência ao usuário que criou a história (Obrigatório)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Título da história de vida
    title: { type: String, required: true, trim: true },

    // Conteúdo da história de vida
    content: { type: String, required: true, trim: true },

    // Lista de imagens associadas à história (Opcional)
    images: [{ type: String, default: [] }],
  },
  { timestamps: true } // Adiciona automaticamente os campos createdAt e updatedAt
)

// Índice no MongoDB para melhorar a performance ao buscar histórias de um memorial
LifeStorySchema.index({ memorial: 1 })

module.exports = mongoose.model("LifeStory", LifeStorySchema)
