const express = require("express")
const router = express.Router()
const MemorialController = require("../controllers/MemorialController")
// Importando o middleware corretamente
const authMiddleware = require("../middlewares/authMiddleware") // Certifique-se de que o caminho está correto!

//router.get("/", MemorialController.list)
//router.get("/:id", MemorialController.view)
//router.post("/", MemorialController.create)
//router.put("/:id", MemorialController.update)
//router.delete("/:id", MemorialController.delete)

router.post("/create-memorial", authMiddleware, (req, res) => {
  //console.log("PASSOU AQUI PARA CRIAR") //, req.body)
  MemorialController.criarMemorial(req, res)
})

// Rota de pesquisa
router.get("/pesquisa", MemorialController.pesquisarMemorial)

// Rota para exibir o formulário de edição de memorial
router.get("/:slug/edit/memorial", MemorialController.editarMemorial)

// Rota para a atualização dos dados do memorial
router.put("/:slug/edit/update", MemorialController.atualizarMemorial)

// Rotas mais específicas primeiro
router.get("/:slug/about", MemorialController.exibirMemorial)
router.get("/:slug/lifestory", MemorialController.exibirLifeStory)
router.get("/:slug/gallery", MemorialController.exibirGallery)
router.get("/:slug/stories", MemorialController.exibirStories)

// Rota genérica que redireciona corretamente
router.get("/:slug", (req, res) => {
  //console.log("Redirecionando para /memorial/:slug/about")
  res.redirect(`/memorial/${req.params.slug}/about`)
})

router.post("/create-memorial", authMiddleware, (req, res) => {
  console.log("PASSOU AQUI PARA CRIAR") //, req.body)
  MemorialController.criarMemorial(req, res)
})

module.exports = router
