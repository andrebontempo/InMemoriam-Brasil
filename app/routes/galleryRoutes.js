const express = require("express")
const router = express.Router()
const MemorialController = require("../controllers/MemorialController")
const GalleryController = require("../controllers/GalleryController")
const upload = require("../middlewares/uploadMiddleware")

// Listar arquivos por tipo
//router.get("/memorial/:slug/gallery", GalleryController.exibirGaleria)

// Rota para editar a galeria
//router.get("/:slug/edit/gallery", GalleryController.editarGallery)

router.get("/edit/:id", GalleryController.editGallery)

/* Upload de novo arquivo para memorial e tipo (fotos, audios, videos)
router.post(
  "/memorial/:slug/:type/upload",
  upload.single("file"),
  GalleryController.uploadArquivo
)

// Excluir arquivo por nome
router.delete(
  "/memorial/:slug/:type/:filename",
  GalleryController.deletarArquivo
)
*/

module.exports = router
