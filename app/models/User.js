const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Apenas usuários do formulário terão senha
    googleId: { type: String, unique: true, sparse: true }, // Apenas usuários do Google terão Google ID
    avatar: { type: String, default: "/images/default-avatar.png" }, // Foto do perfil (padrão caso não tenha)
    authProvider: { type: String, enum: ["local", "google"], required: true }, // Define o tipo de autenticação
  },
  { timestamps: true } // Adiciona automaticamente createdAt e updatedAt
)

// 🔒 Hash da senha antes de salvar no banco
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// 🔑 Método para comparar senha no login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)
