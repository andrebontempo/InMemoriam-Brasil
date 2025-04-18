const express = require("express")
const router = express.Router()
const LifeStoryController = require("../controllers/LifeStoryController")
const upload = require("../middlewares/uploadMiddleware") // Middleware para upload

// Rota para criar uma nova história de vida
router.post("/create", LifeStoryController.createLifeStory)

// Rota para editar uma história de vida
router.get("/edit/:id", LifeStoryController.editLifeStory)

// Rota para atualizar uma história de vida
router.put("/update/:id", LifeStoryController.updateLifeStory)

// Rota para excluir uma história de vida
router.post("/delete/:id", LifeStoryController.deleteLifeStory)

module.exports = router
