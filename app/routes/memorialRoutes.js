const express = require("express")
const router = express.Router()
const MemorialController = require("../controllers/MemorialController")
// Importando o middleware corretamente
const authMiddleware = require("../middlewares/authMiddleware") // Certifique-se de que o caminho está correto!
const LifeStoryController = require("../controllers/LifeStoryController")
const GalleryController = require("../controllers/GalleryController")

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
router.put("/:slug/update/memorial", MemorialController.atualizarMemorial)

// Rota para exibir o formulário de edição de memorial
router.get("/:slug/edit/epitaph", MemorialController.editarEpitaph)

// Rota para a atualização dos dados do memorial
router.put("/:slug/update/epitaph", MemorialController.atualizarEpitaph)

// Rotas mais específicas primeiro
router.get("/:slug/about", MemorialController.exibirMemorial)
router.get("/:slug/lifestory", LifeStoryController.exibirLifeStory) //Esta é que leva para a página de histórias
router.get("/:slug/gallery", GalleryController.exibirGallery)
router.get("/:slug/sharedstory", MemorialController.exibirSharedStories)

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
