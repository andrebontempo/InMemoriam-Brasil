const express = require("express")
const router = express.Router()
const SharedStoryController = require("../controllers/SharedStoryController")
const upload = require("../middlewares/uploadMiddleware") // Middleware para upload

// Rota para criar uma nova história de vida
router.post("/create", SharedStoryController.createSharedStory)

// Rota para editar uma história de vida
router.get("/edit/:id", SharedStoryController.editSharedStory)

// Rota para atualizar uma história de vida
router.put("/update/:id", SharedStoryController.updateSharedStory)

// Rota para excluir uma história de vida
router.post("/delete/:id", SharedStoryController.deleteSharedStory)

module.exports = router
