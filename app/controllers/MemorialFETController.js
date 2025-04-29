const Memorial = require("../models/Memorial")
const Gallery = require("../models/Gallery")
const fs = require("fs")
const path = require("path")

const EpitaphController = {
  editMemorialFET: async (req, res) => {
    /*
    console.log(
      "MEMORIAL-FET - Recebendo requisição PARA EDITAR:",
      req.params.slug
    )
    */
    try {
      // Buscar memorial
      const memorial = await Memorial.findOne({ slug: req.params.slug })
        .populate({ path: "user", select: "firstName lastName" })
        .lean()

      if (!memorial) {
        return res.status(404).send("Memorial não encontrado")
      }

      // Buscar galeria associada
      const galeria = await Gallery.findOne({ memorial: memorial._id })
        .populate({ path: "user", select: "firstName lastName" })
        .select("photos audios videos")
        .lean()

      const galleryData = galeria || {
        photos: [],
        audios: [],
        videos: [],
      }

      return res.render("memorial/edit/memorial-fet", {
        layout: "memorial-layout",
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        slug: memorial.slug,
        mainPhoto: memorial.mainPhoto,
        epitaph: memorial.epitaph,
        birth: {
          date: memorial.birth?.date || "Não informada",
          city: memorial.birth?.city || "Local desconhecido",
          state: memorial.birth?.state || "Estado não informado",
          country: memorial.birth?.country || "País não informado",
        },
        death: {
          date: memorial.death?.date || "Não informada",
          city: memorial.death?.city || "Local desconhecido",
          state: memorial.death?.state || "Estado não informado",
          country: memorial.death?.country || "País não informado",
        },
        gallery: galleryData,
        theme: memorial.theme || "Flores",
      })
    } catch (error) {
      console.error("Erro ao carregar memorial:", error)
      res.status(500).send("Erro interno do servidor")
    }
  },

  // Atualizar memorial
  updateMemorialFET: async (req, res) => {
    /*
    console.log(
      "MEMORIAL-FET - Recebendo requisição para ATUALIZAR:",
      req.params.slug
    )
    */
    try {
      const { slug } = req.params
      const { epitaph, theme } = req.body // Campos de texto que sempre podem ser atualizados

      const memorial = await Memorial.findOne({ slug })

      if (!memorial) {
        return res.status(404).send("Memorial não encontrado")
      }

      // Vamos preparar os dados que queremos atualizar
      const updateData = {
        epitaph,
        theme,
      }

      // Se vier uma nova foto no req.file
      if (req.file) {
        //console.log("Nova foto recebida:", req.file.filename)

        // Caminho da foto atual
        const fotoAntiga = memorial.mainPhoto?.url
        if (fotoAntiga) {
          const caminhoFotoAntiga = path.join(
            __dirname,
            "..",
            "..",
            "public",
            "memorials",
            slug,
            "photos",
            fotoAntiga
          )

          // Verifica se o arquivo existe antes de tentar apagar
          if (fs.existsSync(caminhoFotoAntiga)) {
            fs.unlinkSync(caminhoFotoAntiga)
            //console.log("Foto antiga deletada:", fotoAntiga)
          }
        }

        // Atualizar a mainPhoto no memorial
        updateData.mainPhoto = {
          url: req.file.filename,
          originalName: req.file.originalname,
        }
      }

      // Agora atualiza no banco de dados
      await Memorial.findOneAndUpdate({ slug }, updateData, { new: true })

      // Redirecionar para o memorial
      res.redirect(`/memorial/${slug}`)
    } catch (err) {
      console.error(err)
      res.status(500).send("Erro ao atualizar memorial")
    }
  },
}

module.exports = EpitaphController
