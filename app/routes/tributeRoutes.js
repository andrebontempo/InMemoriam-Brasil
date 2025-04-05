const express = require("express")
const router = express.Router()
const Tribute = require("../models/Tribute") // Supondo que você tenha um modelo de tributo
// Importando o controlador de tributos
const tributeController = require("../controllers/TributeController")
// Importando o middleware corretamente
const authMiddleware = require("../middlewares/authMiddleware") // Certifique-se de que o caminho está correto!

// Rota para listar todos os tributos
router.get("/", async (req, res) => {
  try {
    const tributes = await Tribute.find() // Obtém todos os tributos
    res.render("tributes/index", { tributes }) // Renderiza a página com os tributos
  } catch (err) {
    console.error(err)
    res.status(500).send("Erro ao carregar tributos.")
  }
})

// Rota para criar um novo tributo (GET)
router.get("/create", (req, res) => {
  res.render("tributes/create", { title: "Criar Tributo" })
})

/*
// Rota para criar um novo tributo (POST)
router.post("/create", async (req, res) => {
  try {
    const { type, message, name } = req.body
    const tribute = new Tribute({
      type,
      message,
      name,
      user: req.user._id, // Presumindo que o usuário esteja autenticado
    })

    await tribute.save()
    res.redirect("/tribute") // Redireciona para a lista de tributos
  } catch (err) {
    console.error(err)
    res.status(500).send("Erro ao salvar tributo.")
  }
})
*/

// Rota para criar tributo
router.post("/create", authMiddleware, tributeController.createTribute)
// Rota para DELETAR um tributo específico
router.post("/delete/:id", authMiddleware, tributeController.deleteTribute)

// Rota para EDITAR um tributo específico
router.get("/edit/:id", authMiddleware, tributeController.editarTribute)

// Rota para a atualização dos dados do memorial
router.put("/update/:id", authMiddleware, tributeController.atualizarTribute)

/*
// Rota para deletar um tributo via POST
router.post("/delete/:id", async (req, res) => {
  try {
    const tributeId = req.params.id

    // Encontra e remove o tributo do banco de dados
    await Tribute.findByIdAndDelete(tributeId)

    // Redireciona para a página de tributos após a exclusão
    res.redirect("/tributos")
  } catch (error) {
    console.error("Erro ao deletar tributo:", error)
    res.status(500).send("Erro ao deletar tributo.")
  }
})

*/

module.exports = router
