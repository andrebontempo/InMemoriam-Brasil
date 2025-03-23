const express = require("express")
const router = express.Router()
const MemorialController = require("../controllers/MemorialController")

//router.get("/", MemorialController.list)
//router.get("/:id", MemorialController.view)
//router.post("/", MemorialController.create)
//router.put("/:id", MemorialController.update)
//router.delete("/:id", MemorialController.delete)

//Rota para a criação de memoriais
router.post(
  "/criar-memorial",
  (req, res, next) => {
    //console.log("Requisição recebida para criar memorial.")
    next() // Passa para o controlador
  },
  MemorialController.criarMemorial
)

// Rota de pesquisa
router.get("/pesquisa", MemorialController.pesquisarMemorial)

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

module.exports = router
