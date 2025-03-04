const Memorial = require("../app/models/Memorial")

const MemorialController = {
  criarMemorial: async (req, res) => {
    const { firstName, lastName } = req.body

    if (!firstName || !lastName) {
      return res
        .status(400)
        .render("400", { message: "Nome e sobrenome são obrigatórios!" })
    }

    const slug = `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, "-")

    /*console.log("Slug:", slug)*/

    const memorialContent = `
      <main class="container my-5">
          <div class="bg-white p-4 text-center">
              <h1>Memorial de ${firstName} ${lastName}</h1>
              <p>Homenagem a ${firstName} ${lastName}.</p>
          </div>
      </main>
    `

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
        conteudo: memorialContent,
      })

      await memorial.save()
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
      const memorial = await Memorial.findOne({ slug: nomeSobrenome })

      if (!memorial) {
        return res.status(404).render("404")
      }

      return res.render("memorial", {
        layout: "user-layout",
        conteudo: memorial.conteudo,
      })
    } catch (error) {
      console.error("Erro ao exibir memorial:", error)
      return res
        .status(500)
        .render("500", { message: "Erro ao exibir memorial." })
    }
  },
}

module.exports = MemorialController
