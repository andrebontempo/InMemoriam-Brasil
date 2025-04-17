const Gallery = require("../models/Gallery")
const fs = require("fs")
const path = require("path")
const Memorial = require("../models/Memorial")
const moment = require("moment-timezone")

const GalleryController = {
  // Exibir galeria de um memorial
  exibirGallery: async (req, res) => {
    const { slug } = req.params
    //console.log("ESTOU EM EXIBIR GALERIA - Slug recebido:", slug)
    try {
      const memorial = await Memorial.findOne({ slug })
        .populate({ path: "user", select: "firstName lastName" })
        .populate({ path: "lifeStory", select: "title content eventDate" }) // Populate para lifeStory
        .populate({ path: "sharedStory", select: "title content" }) // Populate para sharedStory
        .populate({ path: "gallery.photos", select: "url" }) // Populate para fotos da galeria
        .populate({ path: "gallery.audios", select: "url" }) // Populate para áudios da galeria
        .populate({ path: "gallery.videos", select: "url" }) // Populate para vídeos da galeria
        .lean() // Converte o documento em um objeto simples

      if (!memorial) {
        return res.status(404).render("errors/404", {
          message: "Memorial não encontrado.",
        })
      }

      // Buscar as photos relacionados ao memorial
      const galeria = await Gallery.findOne({ memorial: memorial._id })
        .populate({ path: "user", select: "firstName lastName" })
        .select("photos audios videos")
        .lean() // Garantir que o resultado seja simples (não um documento Mongoose)

      const galleryData = galeria || {
        photos: [],
        audios: [],
        videos: [],
      }

      //console.log("Galeria:", galeria)

      res.render("memorial/memorial-gallery", {
        layout: "memorial-layout",
        slug: memorial.slug,
        id: memorial._id,
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        gender: memorial.gender,
        kinship: memorial.kinship,
        mainPhoto: memorial.mainPhoto,
        birth: memorial.birth,
        death: memorial.death,
        gallery: galleryData,
        theme: memorial.theme,
        user: {
          firstName: memorial.user?.firstName || "Nome não informado",
          lastName: memorial.user?.lastName || "Sobrenome não informado",
        },
      })
    } catch (error) {
      console.error("Erro ao exibir galeria:", error)
      return res.status(500).render("errors/500", {
        message: "Erro ao exibir galeria.",
      })
    }
  },

  // Editar galeria de um memorial
  editarGallery: async (req, res) => {
    const { slug } = req.params
    //console.log("ESTOU EM EXIBIR GALERIA - Slug recebido:", slug)
    try {
      const memorial = await Memorial.findOne({ slug })
        .populate({ path: "user", select: "firstName lastName" })
        .populate({ path: "lifeStory", select: "title content eventDate" }) // Populate para lifeStory
        .populate({ path: "sharedStory", select: "title content" }) // Populate para sharedStory
        .populate({ path: "gallery.photos", select: "url" }) // Populate para fotos da galeria
        .populate({ path: "gallery.audios", select: "url" }) // Populate para áudios da galeria
        .populate({ path: "gallery.videos", select: "url" }) // Populate para vídeos da galeria
        .lean() // Converte o documento em um objeto simples

      if (!memorial) {
        return res.status(404).render("errors/404", {
          message: "Memorial não encontrado.",
        })
      }

      // Buscar as photos relacionados ao memorial
      const galeria = await Gallery.findOne({ memorial: memorial._id })
        .populate({ path: "user", select: "firstName lastName" })
        .select("photos audios videos")
        .lean() // Garantir que o resultado seja simples (não um documento Mongoose)

      const galleryData = galeria || {
        photos: [],
        audios: [],
        videos: [],
      }

      //console.log("Galeria:", galeria)

      res.render("memorial/edit/gallery", {
        layout: "memorial-layout",
        slug: memorial.slug,
        id: memorial._id,
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        gender: memorial.gender,
        kinship: memorial.kinship,
        mainPhoto: memorial.mainPhoto,
        birth: memorial.birth,
        death: memorial.death,
        gallery: galleryData,
        theme: memorial.theme,
        user: {
          firstName: memorial.user?.firstName || "Nome não informado",
          lastName: memorial.user?.lastName || "Sobrenome não informado",
        },
      })
    } catch (error) {
      console.error("Erro ao exibir galeria:", error)
      return res.status(500).render("errors/500", {
        message: "Erro ao exibir galeria.",
      })
    }
  },

  // Upload de arquivos na galeria
  uploadArquivo: async (req, res) => {
    const { slug, tipo } = req.params
    const file = req.file

    if (!file) return res.status(400).send("Nenhum arquivo enviado")

    try {
      const memorial = await Memorial.findOne({ slug })
      if (!memorial) return res.status(404).send("Memorial não encontrado")

      const novaEntrada = { url: `/memorial/${slug}/${tipo}/${file.filename}` }

      if (!memorial.gallery)
        memorial.gallery = { photos: [], audios: [], videos: [] }

      if (tipo === "fotos") memorial.gallery.photos.push(novaEntrada)
      else if (tipo === "audios") memorial.gallery.audios.push(novaEntrada)
      else if (tipo === "videos") memorial.gallery.videos.push(novaEntrada)

      await memorial.save()
      res.redirect(`/memorial/${slug}/gallery`)
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      res.status(500).render("errors/500")
    }
  },

  // Deletar um arquivo da galeria
  deletarArquivo: async (req, res) => {
    const { slug, tipo, filename } = req.params

    try {
      const memorial = await Memorial.findOne({ slug })
      if (!memorial) return res.status(404).send("Memorial não encontrado")

      const filePath = path.join(
        __dirname,
        "..",
        "public",
        "memorial",
        slug,
        tipo,
        filename
      )
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

      if (tipo === "fotos")
        memorial.gallery.photos = memorial.gallery.photos.filter(
          (m) => !m.url.includes(filename)
        )
      else if (tipo === "audios")
        memorial.gallery.audios = memorial.gallery.audios.filter(
          (m) => !m.url.includes(filename)
        )
      else if (tipo === "videos")
        memorial.gallery.videos = memorial.gallery.videos.filter(
          (m) => !m.url.includes(filename)
        )

      await memorial.save()
      res.redirect(`/memorial/${slug}/gallery`)
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error)
      res.status(500).render("errors/500")
    }
  },
}

module.exports = GalleryController
