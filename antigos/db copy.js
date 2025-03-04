const mongoose = require("mongoose")

const conectarDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/memorialDB") // Opções removidas
    //console.log("✅ Conectado ao MongoDB")
  } catch (error) {
    //console.error("❌ Erro ao conectar ao MongoDB:", error)
    process.exit(1)
  }
}

// Eventos para monitorar o estado da conexão
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB conectado!")
})

mongoose.connection.on("error", (err) => {
  console.error("❌ Erro na conexão com o MongoDB:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB desconectado. Tentando reconectar...")
})

process.on("SIGINT", async () => {
  await mongoose.connection.close()
  console.log(
    "⚠️ Conexão com o MongoDB fechada devido à interrupção do servidor"
  )
  process.exit(0)
})

module.exports = conectarDB
