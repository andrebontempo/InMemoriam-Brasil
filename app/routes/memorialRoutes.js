const express = require("express")
const router = express.Router()
const MemorialController = require("../controllers/MemorialController")
const LifeStoryController = require("../controllers/LifeStoryController")
const SharedStoryController = require("../controllers/SharedStoryController")
const GalleryController = require("../controllers/GalleryController")
const authMiddleware = require("../middlewares/authMiddleware") // Importando o middleware corretamente
//router.get("/", MemorialController.list)
//router.get("/:id", MemorialController.view)
//router.post("/", MemorialController.create)
//router.put("/:id", MemorialController.update)
//router.delete("/:id", MemorialController.delete)

// Rota para pesquisar memorial
router.get("/pesquisa", MemorialController.searchMemorial)

// Rota para criar um memorial
router.post("/create-memorial", authMiddleware, (req, res) => {
  //console.log("PASSOU AQUI PARA CRIAR") //, req.body)
  MemorialController.createMemorial(req, res)
})

// Rota para visualizar memorial
router.get("/:slug/about", MemorialController.showMemorial)

// Rota para editar memorial
router.get("/:slug/edit/memorial", MemorialController.editMemorial)

// Rota para atualizar os dados do memorial
router.put("/:slug/update/memorial", MemorialController.updateMemorial)

//EPITÁFIO
// Rota para editar o epitáfio
router.get("/:slug/edit/epitaph", MemorialController.editEpitaph)

// Rota para atualizar o epitáfio
router.put("/:slug/update/epitaph", MemorialController.updateEpitaph)

// Rotas para exibir histórias de vida, histórias compartilhadas e a galeria
router.get("/:slug/lifestory", LifeStoryController.showLifeStory)
router.get("/:slug/sharedstory", SharedStoryController.showSharedStory)
router.get("/:slug/gallery", GalleryController.showGallery)

// Rota genérica que redireciona corretamente para /memorial/:slug/about"
router.get("/:slug", (req, res) => {
  res.redirect(`/memorial/${req.params.slug}/about`)
})

module.exports = router
