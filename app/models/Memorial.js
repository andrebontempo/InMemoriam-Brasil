const mongoose = require("mongoose")

const MemorialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Criador do memorial
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    gender: { type: String, required: false },
    relationship: { type: String, required: false },

    // **Foto principal**
    mainPhoto: {
      url: { type: String, required: true },
      updatedAt: { type: Date, default: Date.now },
    },

    // **Informações de nascimento**
    birth: {
      date: { type: Date, required: false },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },

    // **Informações de falecimento**
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
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        message: { type: String },
        type: {
          type: String,
          enum: ["vela", "flor", "mensagem"],
          required: true,
        },
        image: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // **Histórias de Vida**
    lifeStory: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title: { type: String, default: "" },
        content: { type: String, default: "" },
        images: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // **Depoimentos e histórias**
    stories: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title: { type: String, default: "" },
        content: { type: String, default: "" },
        images: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // **Galeria (armazenando apenas URLs dos arquivos)**
    gallery: {
      photos: [{ type: String }],
      audios: [{ type: String }],
      videos: [{ type: String }],
    },

    // **Tema do memorial**
    theme: { type: String, default: "blue-theme" },

    // **Histórico de alterações**
    updateLogs: [
      {
        field: { type: String },
        oldValue: { type: mongoose.Schema.Types.Mixed },
        newValue: { type: mongoose.Schema.Types.Mixed },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    // **Timestamp principal do memorial**
  },
  { timestamps: true }
)

// Middleware para registrar atualizações no memorial
MemorialSchema.pre("save", function (next) {
  if (this.isNew) {
    return next() // Se for um novo documento, não precisa registrar mudanças
  }

  const updateLogs = this.updateLogs || []

  // Verifica cada campo do schema para ver se foi modificado
  this.modifiedPaths().forEach((field) => {
    if (field !== "updateLogs") {
      updateLogs.push({
        field,
        oldValue: this.get(field), // Valor antes da alteração
        newValue: this[field], // Novo valor
        updatedAt: Date.now(),
      })
    }
  })

  this.updateLogs = updateLogs
  next()
})

module.exports = mongoose.model("Memorial", MemorialSchema)

/*
Agora, quando um memorial for atualizado, você poderá acessar o histórico de alterações assim:
const memorial = await Memorial.findById(memorialId);
console.log(memorial.updateLogs);
*/
