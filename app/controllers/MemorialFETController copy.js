const Memorial = require("../models/Memorial")

const EpitaphController = {
  editMemorialFET: async (req, res) => {
    console.log("MEMORIAL-FET - Recebendo requisição:", req.params.slug)
    try {
      const memorial = await Memorial.findOne({ slug: req.params.slug })
        .populate({ path: "user", select: "firstName lastName" })
        .lean() // Converte o documento em um objeto simples

      if (!memorial) {
        //console.log("Nenhum memorial encontrado com este slug")
        return res.status(404).send("Memorial não encontrado")
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

      //console.log("Memorial encontrado:", memorial)
      return res.render("memorial/edit/memorial-fet", {
        layout: "memorial-layout",
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        slug: memorial.slug,
        mainPhoto: memorial.mainPhoto,
        epitaph: memorial.epitaph, // || "Nenhum epitáfio fornecido.",
        gallery: galleryData,
        theme: memorial.theme || "Flores",
      })
    } catch (error) {
      res.status(500).send("Erro interno do servidorrrrr")
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
