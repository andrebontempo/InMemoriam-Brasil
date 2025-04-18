const mongoose = require("mongoose")

const SharedStorySchema = new mongoose.Schema(
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
    name: { type: String, required: false, trim: true },

    // Título da história (Opcional, mas recomendado)
    title: { type: String, trim: true, default: "" },

    // Conteúdo da história (Obrigatório)
    content: { type: String, required: true, trim: true },

    // Data específica do acontecimento
    eventDate: { type: Date, required: true },

    // Imagem associada à história
    image: { type: String, default: "" }, // Apenas uma imagem por história
  },
  { timestamps: true } // Adiciona automaticamente os campos createdAt e updatedAt
)

// Índice no MongoDB para melhorar a performance ao buscar histórias de um memorial
SharedStorySchema.index({ memorial: 1 })

module.exports = mongoose.model("SharedStory", SharedStorySchema)
