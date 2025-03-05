const Memorial = require("../app/models/Memorial")

const HomeController = {
  index: (req, res) => {
    res.render("home", { title: "In Memoriam Brasil" })
  },

  criarMemorial: async (req, res) => {
    const { nome, sobrenome } = req.body

    if (!nome || !sobrenome) {
      return res.status(400).send("Nome e sobrenome são obrigatórios!")
    }

    const slug = `${nome}-${sobrenome}`.toLowerCase().replace(/\s+/g, "-")

    const memorialContent = `
      <main class="container my-5">
          <div class="bg-white p-4 text-center">
              <h1>Memorial de ${nome} ${sobrenome}</h1>
              <p>Homenagem a ${nome} ${sobrenome}.</p>
          </div>
      </main>
    `

    try {
      const memorialExistente = await Memorial.findOne({ slug })
      if (memorialExistente) {
        //return res.status(400).send("Já existe um memorial com esse nome.")
        return res.status(400).render("400")
      }

      const memorial = new Memorial({
        nome,
        sobrenome,
        slug,
        conteudo: memorialContent,
      })

      await memorial.save()
      return res.redirect(`/memorial/${slug}`)
    } catch (error) {
      console.error("Erro ao criar memorial:", error)
      //return res.status(500).send("Erro ao criar memorial.")
      return res.status(500).render("500")
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
        layout: "memorial-layout",
        conteudo: memorial.conteudo,
      })
    } catch (error) {
      console.error("Erro ao exibir memorial:", error)
      //return res.status(500).send("Erro ao exibir memorial.")
      return res.status(500).render("500")
    }
  },
}

module.exports = HomeController
