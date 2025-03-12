const Memorial = require("../models/Memorial")
const path = require("path")
const fs = require("fs")

const MemorialController = {
  criarMemorial: async (req, res) => {
    console.log("Corpo da requisição recebido:", req.body) // <-- VERIFICAR O CONTEÚDO
    const {
      firstName,
      lastName,
      gender,
      relationship,
      birth = {}, // Garante um objeto vazio se não vier no req.body
      death = {}, // Garante um objeto vazio se não vier no req.body
      epitaph,
      about,
      lifeStory = [], // Garante um array vazio se não vier no req.body
      stories = [], // Garante um array vazio se não vier no req.body
      gallery = {}, // Garante um objeto vazio se não vier no req.body
      theme,
    } = req.body

    if (!firstName || !lastName) {
      return res
        .status(400)
        .render("400", { message: "Nome e sobrenome são obrigatórios!" })
    }
    const slug = `${firstName}-${lastName}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ç/g, "c")
      .replace(/\s+/g, "-")
    try {
      const memorialExistente = await Memorial.findOne({ slug })
      if (memorialExistente) {
        return res
          .status(400)
          .render("400", { message: "Já existe um memorial com esse nome." })
      }

      const memorial = new Memorial({
        firstName,
        lastName,
        slug,
        gender: gender || "Não informado",
        relationship: relationship || "Não informado",
        birth: {
          date: birth.date || null,
          city: birth.city || "Local desconhecido",
          state: birth.state || "Estado não informado",
          country: birth.country || "País não informadoA",
        },
        death: {
          date: death.date || null,
          city: death.city || "Local desconhecido",
          state: death.state || "Estado não informado",
          country: death.country || "País não informadoA",
        },
        epitaph: epitaph || "Nenhum epitáfio foi cadastrado.",
        about: about || "Nenhuma biografia disponível.",
        lifeStory:
          Array.isArray(lifeStory) && lifeStory.length > 0
            ? lifeStory
            : [
                {
                  title: "História não fornecida",
                  content: "Ainda não há história cadastrada.",
                },
              ],
        stories:
          Array.isArray(stories) && stories.length > 0
            ? stories
            : [
                {
                  title: "Sem histórias",
                  content: "Nenhuma história foi adicionada ainda.",
                },
              ],
        gallery: {
          photos:
            Array.isArray(gallery.photos) && gallery.photos.length > 0
              ? gallery.photos
              : ["https://via.placeholder.com/300?text=Sem+imagens"],
          audios: Array.isArray(gallery.audios) ? gallery.audios : [],
          videos: Array.isArray(gallery.videos) ? gallery.videos : [],
        },
        theme: theme || "blue-theme",
      })

      console.log(memorial)
      await memorial.save()
      return res.redirect(`/memoriais/${slug}`)
    } catch (error) {
      console.error("Erro ao criar memorial:", error)
      return res
        .status(500)
        .render("500", { message: "Erro ao criar memorial." })
    }
  },

  exibirMemorial: async (req, res) => {
    const { slug } = req.params

    try {
      const memorial = await Memorial.findOne({ slug })

      if (!memorial) {
        return res
          .status(404)
          .render("404", { message: "Memorial não encontrado." })
      }

      // Função auxiliar para formatar datas
      const formatarData = (data) => {
        if (!data) return "Não informada"
        return new Date(data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      }

      return res.render("memoriais", {
        layout: "memorial-layout",
        ...memorial.toObject(),
        birth: {
          date: formatarData(memorial.birth?.date),
          city: memorial.birth?.city || "Local desconhecido",
          state: memorial.birth?.state || "Estado não informado",
          country: memorial.birth?.country || "País não informado",
        },
        death: {
          date: formatarData(memorial.death?.date),
          city: memorial.death?.city || "Local desconhecido",
          state: memorial.death?.state || "Estado não informado",
          country: memorial.death?.country || "País não informado",
        },
        about: memorial.about || "Informação não disponível.",
        lifeStory: Array.isArray(memorial.lifeStory) ? memorial.lifeStory : [],
        epitaph: memorial.epitaph || "",
        gallery: memorial.gallery || { photos: [], audios: [], videos: [] },
      })
    } catch (error) {
      console.error("Erro ao exibir memorial:", error)
      return res
        .status(500)
        .render("500", { message: "Erro ao exibir memorial." })
    }
  },

  exibirLifeStory: async (req, res) => {
    const { slug } = req.params

    try {
      // Busca o memorial pelo slug
      const memorial = await Memorial.findOne({ slug })

      if (!memorial) {
        return res.status(404).render("404")
      }

      // Renderiza a página de percurso (Life Story)
      return res.render("memorial-lifestory", {
        layout: "memorial-layout", // Usa o mesmo layout do memorial
        slug: memorial.slug, // Passa o slug para a navbar
        firstName: memorial.firstName, // Nome da pessoa homenageada
        lastName: memorial.lastName,
        lifeStory:
          memorial.lifeStory || "História de vida ainda não foi cadastrada.",
      })
    } catch (error) {
      console.error("Erro ao exibir percurso:", error)
      return res
        .status(500)
        .render("500", { message: "Erro ao exibir percurso." })
    }
  },

  exibirGallery: async (req, res) => {
    const { slug } = req.params
    try {
      // Busca o memorial pelo slug
      const memorial = await Memorial.findOne({ slug })
      if (!memorial) {
        return res.status(404).render("404")
      }

      // Renderiza a página de Galeria)
      return res.render("memorial-gallery", {
        layout: "memorial-layout", // Usa o mesmo layout do memorial
        slug: memorial.slug, // Passa o slug para a navbar
        firstName: memorial.firstName, // Nome da pessoa homenageada
        lastName: memorial.lastName,
        //gallery: memorial.gallery || [],
      })
    } catch (error) {
      console.error("Erro ao exibir galeria:", error)
      return res
        .status(500)
        .render("500", { message: "Erro ao exibir galeria." })
    }
  },
  exibirStories: async (req, res) => {
    const { slug } = req.params
    try {
      // Busca o memorial pelo slug
      const memorial = await Memorial.findOne({ slug })

      if (!memorial) {
        return res.status(404).render("404")
      }

      // Renderiza a página Histórias
      return res.render("memorial-stories", {
        layout: "memorial-layout", // Usa o mesmo layout do memorial
        slug: memorial.slug, // Passa o slug para a navbar
        firstName: memorial.firstName, // Nome da pessoa homenageada
        lastName: memorial.lastName,
        stories:
          memorial.stories ||
          "Exibindo Stories - História de vida ainda não foi cadastrada.",
      })
    } catch (error) {
      console.error("Erro ao exibir Histórias:", error)
      return res
        .status(500)
        .render("500", { message: "Erro ao exibir Histórias." })
    }
  },
  // Método para exibir a página de pesquisa de memoriais
  pesquisarMemorial: async (req, res) => {
    const termo = req.query.q // Obtém o termo digitado na pesquisa
    if (!termo) {
      return res.render("memorial-pesquisa", { resultados: [], termo })
    }

    try {
      const resultados = await Memorial.find({
        $or: [
          { firstName: { $regex: termo, $options: "i" } }, // Busca pelo primeiro nome (case-insensitive)
          { lastName: { $regex: termo, $options: "i" } }, // Busca pelo sobrenome (case-insensitive)
        ],
      }).lean() // Exibição da data. Adiciona o .lean() para garantir que os resultados sejam objetos simples

      res.render("memorial-pesquisa", { resultados, termo })
    } catch (error) {
      console.error("Erro na pesquisa:", error)
      res.status(500).render("500", { message: "Erro ao realizar a pesquisa." })
    }
  },
}

module.exports = MemorialController
