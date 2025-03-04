const mongoose = require("mongoose")

const conectarDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/memorialDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Conectado ao MongoDB")
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error)
    process.exit(1)
  }
}

module.exports = conectarDB
