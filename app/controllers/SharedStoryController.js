const SharedStory = require("../models/SharedStory")
const Memorial = require("../models/Memorial")
const path = require("path")
const fs = require("fs")
const moment = require("moment-timezone")

const SharedStoryController = {
  // Criar uma nova história compartilhada
  createSharedStory: async (req, res) => {
    const userCurrent = req.session.loggedUser
    //console.log("CRIAÇÃO DO SharedStory - Body recebido:", req.body)
    try {
      // Buscar o memorial pelo ID (se estiver no body) ou pelo slug (se necessário)
      let memorial = await Memorial.findById(req.body.memorial)

      if (!memorial) {
        // Tentar buscar pelo slug caso o ID não tenha sido encontrado
        memorial = await Memorial.findOne({ slug: req.params.slug })
      }

      if (!memorial) {
        console.error("Erro: Memorial não encontrado!")
        return res.status(404).send("Memorial não encontrado")
      }

      const newSharedStory = new SharedStory({
        memorial: memorial._id,
        user: userCurrent ? userCurrent._id : null,
        title: req.body.title,
        content: req.body.content,
        eventDate: req.body.eventDate,
        image: req.file.filename,
      })

      await newSharedStory.save()

      res.redirect(`/memorial/${memorial.slug}/sharedstory`)
    } catch (error) {
      console.error("Erro ao criar história compartilhada:", error)
      res.status(500).render("errors/500")
    }
  },

  // Exibir histórias compartilhadas de um memorial
  showSharedStory: async (req, res) => {
    const { slug } = req.params
    //console.log("ESTOU AQUI EXIBIR SHAREDSTORY - Slug recebido:", slug)
    try {
      const memorial = await Memorial.findOne({ slug })
        .populate({ path: "user", select: "firstName lastName" })
        .populate({ path: "lifeStory", select: "title content eventDate" }) // Populate para lifeStory
        .populate({ path: "sharedStory", select: "title content eventDate" }) // Populate para sharedStory
        .populate({ path: "gallery.photos", select: "url" }) // Populate para fotos da galeria
        .populate({ path: "gallery.audios", select: "url" }) // Populate para áudios da galeria
        .populate({ path: "gallery.videos", select: "url" }) // Populate para vídeos da galeria
        .lean() // Converte o documento em um objeto simples

      if (!memorial) {
        return res.status(404).render("errors/404", {
          message: "Memorial não encontrado.",
        })
      }

      // Buscar os Sharedstories relacionados ao memorial
      const sharedstories = await SharedStory.find({ memorial: memorial._id })
        .sort({ eventDate: 1 }) // 1 = crescente
        .populate({ path: "user", select: "firstName lastName" }) // Aqui, populando o campo user com firstName e lastName
        .select("title content eventDate image createdAt") // Selecionando campos específicos dos tributos
        .lean() // Garantir que o resultado seja simples (não um documento Mongoose)

      //console.log("Sharedstories encontrados:", sharedstories)

      return res.render("memorial/memorial-sharedstory", {
        layout: "memorial-layout",
        user: {
          firstName: memorial.user.firstName || "Primeiro Nome Não informado",
          lastName: memorial.user.lastName || "Último Nome Não informado",
        },
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        slug: memorial.slug,
        id: memorial._id,
        gender: memorial.gender,
        kinship: memorial.kinship,
        mainPhoto: memorial.mainPhoto,
        //tribute: tributes || [], // Passando os tributos para o template
        //lifeStory: lifestories || [], // Passando lifeStory para o template
        sharedStory: sharedstories || [], // Passando stories para o template
        gallery: memorial.gallery || {
          photos: [],
          audios: [],
          videos: [],
        },
        //idade: calcularIdade(memorial.birth?.date, memorial.death?.date),
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
        about: memorial.about,
        epitaph: memorial.epitaph, // || "",
        theme: memorial.theme, // || "blue-theme",
      })
    } catch (error) {
      console.error("Erro ao exibir memorial:", error)
      return res.status(500).render("errors/500", {
        message: "Erro ao exibir memorial.",
      })
    }
  },

  // Editar uma história compartilhada
  editSharedStory: async (req, res) => {
    try {
      const sharedStory = await SharedStory.findById(req.params.id).populate(
        "memorial"
      )

      if (!sharedStory) {
        return res.status(404).send("História compartilhada não encontrada")
      }

      if (req.file) {
        if (sharedStory.image) {
          const oldPath = path.join(
            __dirname,
            "..",
            "public",
            sharedStory.image
          )
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        }
        sharedStory.image = `/uploads/${req.file.filename}`
      }

      res.render("memorial/edit/sharedstory", {
        layout: "memorial-layout",
        sharedStory: sharedStory.toObject(),
        slug: sharedStory.memorial.slug,
        mainPhoto: sharedStory.memorial.mainPhoto,
        eventDate: moment(sharedStory.eventDate).format("YYYY-MM-DD"),
        birth: sharedStory.memorial.birth,
        death: sharedStory.memorial.death,
      })
    } catch (error) {
      console.error("Erro ao editar história compartilhada:", error)
      res.status(500).send("Erro interno do servidor")
    }
  },

  // Atualizar uma história compartilhada existente
  updateSharedStory: async (req, res) => {
    try {
      const { title, content, eventDate, slug } = req.body
      const sharedStory = await SharedStory.findById(req.params.id)

      if (!sharedStory) {
        return res.status(404).send("História compartilhada não encontrada")
      }

      if (req.file) {
        if (sharedStory.image) {
          const oldPath = path.join(
            __dirname,
            "..",
            "public",
            sharedStory.image
          )
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        }
        sharedStory.image = `/uploads/${req.file.filename}`
      }

      sharedStory.title = title
      sharedStory.content = content

      if (eventDate && eventDate.trim() !== "") {
        sharedStory.eventDate = moment(eventDate, "YYYY-MM-DD").toDate()
      }

      await sharedStory.save()
      res.redirect(`/memorial/${slug}/sharedstory`)
    } catch (error) {
      console.error("Erro ao atualizar história compartilhada:", error)
      res.status(500).send("Erro interno do servidor")
    }
  },

  // Deletar uma história compartilhada
  deleteSharedStory: async (req, res) => {
    try {
      const sharedStory = await SharedStory.findById(req.params.id).populate(
        "memorial"
      )

      if (!sharedStory) {
        return res.status(404).send("História compartilhada não encontrada")
      }

      if (sharedStory.image) {
        const imagePath = path.join(
          __dirname,
          "..",
          "public",
          sharedStory.image
        )
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
      }

      await SharedStory.findByIdAndDelete(req.params.id)
      res.redirect(`/memorial/${sharedStory.memorial.slug}/sharedstory`)
    } catch (error) {
      console.error("Erro ao deletar história compartilhada:", error)
      res.status(500).send("Erro interno do servidor")
    }
  },
}
// Exporta o controlador
module.exports = SharedStoryController
