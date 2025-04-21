// app/middlewares/uploadMiddleware.js
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Função auxiliar para identificar o tipo de mídia
function getMediaFolder(mimetype) {
  if (mimetype.startsWith("image/")) return "photos"
  if (mimetype.startsWith("audio/")) return "audios"
  if (mimetype.startsWith("video/")) return "videos"
  return "others"
}

// Configuração de armazenamento dinâmica
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Obter o slug a partir da rota
    //const { slug } = req.params

    // Verifique se o slug está sendo passado corretamente
    const slug = req.body.slug || req.params.slug
    //console.log("Slug BODY:", req.body)
    //console.log("Slug PARAMS:", req.params)

    if (!slug) {
      return cb(new Error("Slug não fornecido."))
    }

    // Identificar a pasta do tipo de arquivo
    const mediaFolder = getMediaFolder(file.mimetype)

    // Definir o caminho de upload para o diretório do memorial
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "memorials",
      slug, // Usar o slug como pasta para o memorial
      mediaFolder // Fotos, áudios ou vídeos
    )

    // Garante que a pasta existe (criação da pasta caso não exista)
    fs.mkdirSync(uploadPath, { recursive: true })

    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = Date.now() + ext
    cb(null, filename)
  },
})

const upload = multer({ storage })

module.exports = upload
