const mongoose = require("mongoose")

const MemorialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    }, // Dono do memorial
    firstName: { type: String, required: true }, // Nome obrigatório
    lastName: { type: String, required: true }, // Sobrenome obrigatório
    slug: { type: String, unique: true, required: true }, // URL única do memorial
    gender: { type: String, required: false },
    relationship: { type: String, required: false },

    // Informações de nascimento
    birth: {
      date: { type: Date, required: false },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },

    // Informações de falecimento
    death: {
      date: { type: Date, required: false },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },

    // **Epitáfio**
    epitaph: { type: String, maxlength: 255 },
    epitaphTimestamp: { type: Date, default: Date.now },

    // **Sobre o memorial**
    about: { type: String },

    // **Tributos (homenagens feitas por outros usuários)**
    tribute: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Quem fez o tributo
        name: { type: String, required: true }, // Nome do usuário que prestou a homenagem
        message: { type: String }, // Mensagem do tributo
        type: {
          type: String,
          enum: ["vela", "flor", "mensagem"],
          required: true,
        }, // Tipo da homenagem
        image: { type: String, default: "" }, // Imagem opcional na homenagem
        createdAt: { type: Date, default: Date.now }, // Timestamp do tributo
      },
    ],

    // **Histórias de Vida**
    lifeStory: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Quem publicou
        title: { type: String, default: "" }, // Título opcional
        content: { type: String, default: "" }, // Texto da história
        images: [{ type: String }], // URLs de imagens associadas
        createdAt: { type: Date, default: Date.now }, // Timestamp
      },
    ],

    // **Depoimentos e histórias**
    stories: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Quem publicou
        title: { type: String, default: "" }, // Título opcional
        content: { type: String, default: "" }, // Texto da história
        images: [{ type: String }], // URLs de imagens associadas
        createdAt: { type: Date, default: Date.now }, // Timestamp
      },
    ],

    // **Galeria (armazenando apenas URLs dos arquivos)**
    gallery: {
      photos: [{ type: String }], // URLs das imagens
      audios: [{ type: String }], // URLs dos áudios
      videos: [{ type: String }], // URLs dos vídeos
    },

    // **Tema do memorial**
    theme: { type: String, default: "blue-theme" }, // Define o CSS a ser aplicado no memorial

    // **Timestamp principal do memorial**
    createdAt: { type: Date, default: Date.now }, // Data de criação do memorial
  },
  { timestamps: true } // Garante que todos os documentos tenham `createdAt` e `updatedAt`
)

module.exports = mongoose.model("Memorial", MemorialSchema)
