const mongoose = require("mongoose")

const StorySchema = new mongoose.Schema(
  {
    // Referência ao Memorial ao qual esta história pertence (Obrigatório)
    memorial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Memorial",
      required: true,
    },

    // Referência ao usuário que criou a história (Opcional - pode ser anônimo)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Nome do autor (necessário se for anônimo)
    name: { type: String, required: true, trim: true },

    // Título da história (Opcional, mas recomendado)
    title: { type: String, trim: true, default: "" },

    // Conteúdo da história (Obrigatório)
    content: { type: String, required: true, trim: true },

    // Lista de imagens associadas à história (Opcional)
    images: [{ type: String, default: [] }],
  },
  { timestamps: true } // Adiciona automaticamente os campos createdAt e updatedAt
)

// Índice no MongoDB para melhorar a performance ao buscar histórias de um memorial
StorySchema.index({ memorial: 1 })

module.exports = mongoose.model("Story", StorySchema)
