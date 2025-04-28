const Memorial = require("../models/Memorial")
const Gallery = require("../models/Gallery")

const EpitaphController = {
  editMemorialFET: async (req, res) => {
    console.log("MEMORIAL-FET - Recebendo requisição:", req.params.slug)
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
      "EPITAPH - Recebendo requisição para atualizar epitaph:",
      req.params.slug
    )

    console.log("Body recebido:", req.body)
    console.log("Método da requisição:", req.method)
    console.log("Body recebido:", req.body)
    */
    try {
      const { slug } = req.params
      //const { gender, relationship, birth, death } = req.body // Aqui você pode pegar os dados do formulário
      const updateData = req.body

      await Memorial.findOneAndUpdate({ slug: slug }, updateData, { new: true })

      /*
      // Lógica para encontrar e atualizar o memorial no banco
      const memorial = await Memorial.findOneAndUpdate(
        { slug: slug },
        { gender, relationship, birth, death },
        { new: true } // Retorna o memorial atualizado
      )
      */

      // Redirecionar ou exibir o memorial atualizado
      res.redirect(`/memorial/${slug}`) // Ou qualquer outro redirecionamento que faça sentido
    } catch (err) {
      console.error(err)
      res.status(500).send("Erro ao atualizar memorial")
    }
  },
}

module.exports = EpitaphController
