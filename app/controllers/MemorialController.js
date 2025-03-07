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
    } = req.body

    if (!firstName || !lastName) {
      return res
        .status(400)
        .render("400", { message: "Nome e sobrenome são obrigatórios!" })
    }

    // Gera o slug
    //const slug = `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, "-")
    const slug = `${firstName}-${lastName}` // Junta o primeiro e o último nome com um hífen
      .toLowerCase() // Converte todos os caracteres para minúsculas
      .normalize("NFD") // Separa os caracteres acentuados dos seus diacríticos
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos, til, etc.)
      .replace(/ç/g, "c") // Substitui a letra "ç" por "c"
      .replace(/\s+/g, "-") // Substitui espaços em branco por hífen ("-")

    // Conteúdo do memorial (pode ser ajustado conforme necessário)
    const memorialContent = `
      <main class="container my-5">
          <div class="bg-white p-4 text-center">
              <h1>Memorial de ${firstName} ${lastName}</h1>
              <p>Homenagem a ${firstName} ${lastName}.</p>
          </div>
      </main>
    `

    try {
      // Verifica se já existe um memorial com o mesmo slug
      const memorialExistente = await Memorial.findOne({ slug })
      if (memorialExistente) {
        return res
          .status(400)
          .render("400", { message: "Já existe um memorial com esse nome." })
      }

      // Cria o objeto memorial com todos os campos
      const memorial = new Memorial({
        firstName,
        lastName,
        slug,
        gender,
        relationship,
        birth: {
          date: birth?.date || null,
          city: birth?.city || "",
          state: birth?.state || "",
          country: birth?.country || "",
        },
        death: {
          date: death?.date || null,
          city: death?.city || "",
          state: death?.state || "",
          country: death?.country || "",
        },
        about,
        lifeStory,
        theme: theme || "blue-theme", // Valor padrão
        conteudo: memorialContent,
      })

      // Salva o memorial no banco de dados
      await memorial.save()

      // Redireciona para a página do memorial
      return res.redirect(`/memorial/${slug}`)
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
      // Busca o memorial pelo slug
      const memorial = await Memorial.findOne({ slug: nomeSobrenome })

      if (!memorial) {
        return res.status(404).render("404")
      }

      // Renderiza a página do memorial
      return res.render("memorial", {
        layout: "memorial-layout",
        firstName: memorial.firstName, // Passa o primeiro nome
        lastName: memorial.lastName, // Passa o sobrenome
        slug: memorial.slug, // Adiciona o slug para ser usado na navbar
        birth: memorial.birth || {}, // Evita erro se birth for undefined
        death: memorial.death || {}, // Evita erro se death for undefined
        about: memorial.about || "Informação não disponível.",
        lifeStory: memorial.lifeStory || "História não fornecida.",
        conteudo: memorial.conteudo || "<p>Sem conteúdo adicional.</p>",
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
}

module.exports = MemorialController
