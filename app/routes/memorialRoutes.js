const express = require("express")
const router = express.Router()
const MemorialController = require("../controllers/MemorialController")
const EpitaphController = require("../controllers/EpitaphController")
const TributeController = require("../controllers/TributeController")
const LifeStoryController = require("../controllers/LifeStoryController")
const SharedStoryController = require("../controllers/SharedStoryController")
const GalleryController = require("../controllers/GalleryController")
const authMiddleware = require("../middlewares/authMiddleware")
const upload = require("../middlewares/uploadMiddleware")

//*********ROTAS PARA O GALELRY CONTROLLER***********
router.get("/:slug/gallery", GalleryController.showGallery)
// Rotas para editar a galeria
router.post(
  "/:slug/gallery/update/:tipo",
  upload.single("file"),
  authMiddleware,
  GalleryController.updateGallery
)

router.get(
  "/:slug/gallery/edit/:id",
  authMiddleware,
  GalleryController.editGallery
)

router.post(
  "/:slug/gallery/delete/:tipo",
  authMiddleware,
  GalleryController.deleteFile
)

//*********ROTAS PARA O SHAREDSTORY CONTROLLER***********
// Rota para criar uma nova história de vida
router.post(
  "/:slug/sharedstory/create",
  authMiddleware,
  upload.single("file"),
  SharedStoryController.createSharedStory
)
// Rota para mostrar uma história compartilhada
router.get("/:slug/sharedstory", SharedStoryController.showSharedStory)
// Rota para editar uma história de vida
router.get("/:slug/sharedstory/edit/:id", SharedStoryController.editSharedStory)
// Rota para atualizar uma história COmpartilhada com POST
router.post(
  "/:slug/sharedstory/update/:id",
  upload.single("file"),
  (req, res) => {
    // Verificar se o campo _method existe e se é 'PUT'
    if (req.body._method && req.body._method === "PUT") {
      // Chama o controller de atualização se o _method for PUT
      return SharedStoryController.updateSharedStory(req, res)
    }
    // Caso contrário, retorna um erro de método não permitido
    res.status(400).send("Método não permitido")
  }
)

// Rota para excluir uma história compartilhada
router.post(
  "/:slug/sharedstory/delete/:id",
  SharedStoryController.deleteSharedStory
)

//*********ROTAS PARA O LIFESTORY CONTROLLER***********
router.post(
  "/:slug/lifestory/create",
  authMiddleware,
  upload.single("file"),
  LifeStoryController.createLifeStory
)
// Rota para mostrar uma história de vida
router.get("/:slug/lifestory", LifeStoryController.showLifeStory)
// Rota para editar uma história de vida
router.get("/:slug/lifestory/edit/:id", LifeStoryController.editLifeStory)
// Rota para atualizar uma história de vida com POST
router.post(
  "/:slug/lifestory/update/:id",
  upload.single("file"),
  (req, res) => {
    // Verificar se o campo _method existe e se é 'PUT'
    if (req.body._method && req.body._method === "PUT") {
      // Chama o controller de atualização se o _method for PUT
      return LifeStoryController.updateLifeStory(req, res)
    }
    // Caso contrário, retorna um erro de método não permitido
    res.status(400).send("Método não permitido")
  }
)
// Rota para excluir uma história de vida
router.post("/:slug/lifestory/delete/:id", LifeStoryController.deleteLifeStory)

//*********ROTAS PARA O TRIBUTE CONTROLLER***********
router.post(
  "/:slug/tribute/create",
  authMiddleware,
  TributeController.createTribute
)
router.get(
  "/:slug/tribute/edit/:id",
  authMiddleware,
  TributeController.editTribute
)
router.post(
  "/:slug/tribute/update/:id",
  (req, res) => {
    // Verificar se o campo _method existe e se é 'PUT'
    if (req.body._method && req.body._method === "PUT") {
      // Chama o controller de atualização se o _method for PUT
      return TributeController.updateTribute(req, res)
    }
    // Caso contrário, retorna um erro de método não permitido
    res.status(400).send("Método não permitido")
  },
  authMiddleware,
  TributeController.updateTribute
)
router.post(
  "/:slug/tribute/delete/:id",
  authMiddleware,
  TributeController.deleteTribute
)

//*********ROTAS PARA O EPITAPH CONTROLLER***********
// Rota para editar o epitáfio
router.get("/:slug/epitaph/edit", EpitaphController.editEpitaph)
// Rota para atualizar o epitáfio
router.put("/:slug/epitaph/update", EpitaphController.updateEpitaph)

//*********ROTAS PARA O MEMORIAL CONTROLLER***********
router.get("/pesquisa", MemorialController.searchMemorial)
router.post(
  "/create-memorial",
  authMiddleware,
  MemorialController.createMemorial
)
router.get("/:slug/about", MemorialController.showMemorial)
router.get("/:slug/memorial/edit", MemorialController.editMemorial)
router.post(
  "/:slug/memorial/update",
  (req, res) => {
    // Verificar se o campo _method existe e se é 'PUT'
    if (req.body._method && req.body._method === "PUT") {
      // Chama o controller de atualização se o _method for PUT
      return MemorialController.updateMemorial(req, res)
    }
    // Caso contrário, retorna um erro de método não permitido
    res.status(400).send("Método não permitido")
  },
  MemorialController.updateMemorial
)
// Rota genérica para /memorial/:slug/about"
router.get("/:slug", (req, res) => {
  res.redirect(`/memorial/${req.params.slug}/about`)
})

module.exports = router
