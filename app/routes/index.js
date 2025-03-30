const express = require("express")
const router = express.Router()

// Importa as rotas modulares
const homeRoutes = require("./homeRoutes")
const authRoutes = require("./authRoutes")
const memorialRoutes = require("./memorialRoutes")
const tributeRoutes = require("./tributeRoutes")

// Usa as rotas nos caminhos apropriados
router.use("/", homeRoutes)
router.use("/auth", authRoutes)
router.use("/memorial", memorialRoutes)
router.use("/tribute", tributeRoutes)

// Rota para páginas não encontradas (ERRO 404)
router.use((req, res) => {
  res
    .status(404)
    .render("errors/404", { title: "Página Não Encontrada", layout: "main" })
})

module.exports = router
