const express = require("express")
const router = express.Router()
const LifeStoryController = require("../controllers/LifeStoryController")
const upload = require("../middlewares/uploadMiddleware") // Middleware para upload

// Rota para visualizar histórias de vida de um memorial
//router.get("/:memorialId", LifeStoryController.getLifeStories)
router.get("memorial/:slug/lifestory", LifeStoryController.exibirLifeStory)

// Rota para criar uma nova história de vida
router.post("/create", LifeStoryController.createLifeStory)

// Rota para editar uma história de vida
router.get("/edit/:id", LifeStoryController.editLifeStory)

// Rota para atualizar uma história de vida
router.put("/update/:id", LifeStoryController.updateLifeStory)

// Rota para excluir uma história de vida
router.post("/delete/:id", LifeStoryController.deleteLifeStory)

// Rota sugerida pelo ChatGPT

// Criar uma nova história (com upload de imagem)
//router.post("/create", upload.single("image"), LifeStoryController.create)

// Editar uma história existente (com upload de imagem opcional)
//router.post("/edit/:id", upload.single("image"), LifeStoryController.update)

module.exports = router
