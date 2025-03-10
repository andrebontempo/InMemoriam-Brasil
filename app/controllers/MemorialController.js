const Memorial = require("../models/Memorial")

const MemorialController = {
  criarMemorial: async (req, res) => {
    const {
      firstName,
      lastName,
      gender,
      relationship,
      birth,
      death,
      about,
      lifeStory,
      theme,
      epitaph,
      gallery,
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
        gender,
        relationship,
        birth: birth || {},
        death: death || {},
        about,
        lifeStory,
        theme: theme || "blue-theme",
        epitaph,
        gallery: gallery || [],
      })

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
    const { nomeSobrenome } = req.params

    try {
      const memorial = await Memorial.findOne({ slug: nomeSobrenome })

      if (!memorial) {
        return res.status(404).render("404")
      }

      return res.render("memoriais", {
        layout: "memorial-layout",
        ...memorial.toObject(),
        birth: memorial.birth || {},
        death: memorial.death || {},
        about: memorial.about || "Informação não disponível.",
        lifeStory: memorial.lifeStory || "História não fornecida.",
        epitaph: memorial.epitaph || "",
        gallery: memorial.gallery || [],
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
