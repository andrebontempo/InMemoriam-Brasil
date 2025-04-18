const express = require("express")
const router = express.Router()
const Tribute = require("../models/Tribute") // Supondo que você tenha um modelo de tributo
const tributeController = require("../controllers/TributeController") // Importando o controlador de tributos
const authMiddleware = require("../middlewares/authMiddleware") // Importando o middleware corretamente

// Rota para criar tributo
router.post("/create", authMiddleware, tributeController.createTribute)
// Rota para EDITAR um tributo específico
router.get("/edit/:id", authMiddleware, tributeController.editTribute)
// Rota para a atualização dos dados do memorial
router.put("/update/:id", authMiddleware, tributeController.updateTribute)
// Rota para DELETAR um tributo específico
router.post("/delete/:id", authMiddleware, tributeController.deleteTribute)

module.exports = router
