const Memorial = require("../models/Memorial")
const path = require("path")
const fs = require("fs")
const { exibirLifeStory } = require("./MemorialController copy 3")

const MemorialController = {
  criarMemorial: async (req, res) => {
    console.log("Requisição recebida para criar memorial.")
    console.log("Corpo da requisição recebido:", req.body) // <-- Verifica os dados enviados

    const { firstName, lastName, gender, relationship, epitaph, about, theme } =
      req.body

    // Ajusta o objeto `birth` garantindo valores padrões
    const birth = {
      date: req.body["birth.date"] || null,
      city: req.body["birth.city"] || "Local desconhecido",
      state: req.body["birth.state"] || "Estado não informado",
      country: req.body["birth.country"] || "País não informado",
    }

    // Ajusta o objeto `death` garantindo valores padrões
    const death = {
      date: req.body["death.date"] || null,
      city: req.body["death.city"] || "Local desconhecido",
      state: req.body["death.state"] || "Estado não informado",
      country: req.body["death.country"] || "País não informado",
    }

    // Ajusta a galeria para garantir um array mesmo que esteja vazio
    const gallery = {
      photos: req.body["gallery.photos"]
        ? [req.body["gallery.photos"]]
        : ["https://via.placeholder.com/300?text=Sem+imagens"],
      audios: req.body["gallery.audios"] ? [req.body["gallery.audios"]] : [],
      videos: req.body["gallery.videos"] ? [req.body["gallery.videos"]] : [],
    }

    // Verifica se nome e sobrenome foram informados
    if (!firstName || !lastName) {
      return res
        .status(400)
        .render("400", { message: "Nome e sobrenome são obrigatórios!" })
    }

    // Gera o slug baseado no nome
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
        epitaph: epitaph || "Nenhum epitáfio foi cadastrado.",
        birth,
        death,
        about: about || "Nenhuma biografia disponível.",
        lifeStory: [
          {
            title: "História não fornecida",
            content: "Ainda não há história cadastrada.",
          },
        ],
        stories: [
          {
            title: "Sem histórias",
            content: "Nenhuma história foi adicionada ainda.",
          },
        ],
        gallery,
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
        return res.status(404).render("404", {
          message: "Memorial não encontrado.",
        })
      }

      const formatarData = (data) => {
        if (!data || isNaN(new Date(data))) return "Não informada"
        return new Date(data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      }

      return res.render("memorial-about", {
        layout: "memorial-layout",
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        slug: memorial.slug,
        gender: memorial.gender,
        relationship: memorial.relationship,
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
        epitaph: memorial.epitaph || "Nenhum epitáfio fornecido.",
        lifeStory: Array.isArray(memorial.lifeStory) ? memorial.lifeStory : [],
        stories: Array.isArray(memorial.stories) ? memorial.stories : [],
        gallery: memorial.gallery || {
          photos: ["https://via.placeholder.com/300?text=Sem+imagens"],
          audios: [],
          videos: [],
        },
        theme: memorial.theme || "blue-theme",
      })
    } catch (error) {
      console.error("Erro ao exibir memorial:", error)
      return res.status(500).render("500", {
        message: "Erro ao exibir memorial.",
      })
    }
  },

  exibirLifeStory: async (req, res) => {
    const { slug } = req.params

    try {
      const memorial = await Memorial.findOne({ slug })

      if (!memorial) {
        return res.status(404).render("404", {
          message: "Memorial não encontrado.",
        })
      }

      const formatarData = (data) => {
        if (!data || isNaN(new Date(data))) return "Não informada"
        return new Date(data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      }

      return res.render("memorial-lifestory", {
        layout: "memorial-layout",
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        slug: memorial.slug,
        gender: memorial.gender,
        relationship: memorial.relationship,
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
        epitaph: memorial.epitaph || "Nenhum epitáfio fornecido.",
        lifeStory: Array.isArray(memorial.lifeStory) ? memorial.lifeStory : [],
        stories: Array.isArray(memorial.stories) ? memorial.stories : [],
        gallery: memorial.gallery || {
          photos: ["https://via.placeholder.com/300?text=Sem+imagens"],
          audios: [],
          videos: [],
        },
        theme: memorial.theme || "blue-theme",
      })
    } catch (error) {
      console.error("Erro ao exibir memorial:", error)
      return res.status(500).render("500", {
        message: "Erro ao exibir memorial.",
      })
    }
  },

  exibirGallery: async (req, res) => {
    const { slug } = req.params
    try {
      const memorial = await Memorial.findOne({ slug })

      if (!memorial) {
        return res.status(404).render("404", {
          message: "Memorial não encontrado.",
        })
      }

      const formatarData = (data) => {
        if (!data || isNaN(new Date(data))) return "Não informada"
        return new Date(data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      }

      return res.render("memorial-gallery", {
        layout: "memorial-layout",
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        slug: memorial.slug,
        gender: memorial.gender,
        relationship: memorial.relationship,
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
        epitaph: memorial.epitaph || "Nenhum epitáfio fornecido.",
        lifeStory: Array.isArray(memorial.lifeStory) ? memorial.lifeStory : [],
        stories: Array.isArray(memorial.stories) ? memorial.stories : [],
        gallery: memorial.gallery || {
          photos: ["https://via.placeholder.com/300?text=Sem+imagens"],
          audios: [],
          videos: [],
        },
        theme: memorial.theme || "blue-theme",
      })
    } catch (error) {
      console.error("Erro ao exibir memorial:", error)
      return res.status(500).render("500", {
        message: "Erro ao exibir memorial.",
      })
    }
  },

  exibirStories: async (req, res) => {
    const { slug } = req.params
    try {
      const memorial = await Memorial.findOne({ slug })

      if (!memorial) {
        return res.status(404).render("404", {
          message: "Memorial não encontrado.",
        })
      }

      const formatarData = (data) => {
        if (!data || isNaN(new Date(data))) return "Não informada"
        return new Date(data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      }

      return res.render("memorial-stories", {
        layout: "memorial-layout",
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        slug: memorial.slug,
        gender: memorial.gender,
        relationship: memorial.relationship,
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
        epitaph: memorial.epitaph || "Nenhum epitáfio fornecido.",
        lifeStory: Array.isArray(memorial.lifeStory) ? memorial.lifeStory : [],
        stories: Array.isArray(memorial.stories) ? memorial.stories : [],
        gallery: memorial.gallery || {
          photos: ["https://via.placeholder.com/300?text=Sem+imagens"],
          audios: [],
          videos: [],
        },
        theme: memorial.theme || "blue-theme",
      })
    } catch (error) {
      console.error("Erro ao exibir memorial:", error)
      return res.status(500).render("500", {
        message: "Erro ao exibir memorial.",
      })
    }
  },

  // Método para exibir a página de pesquisa por memorial
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
