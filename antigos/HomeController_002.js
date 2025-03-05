const fs = require("fs")
const path = require("path")

const HomeController = {
  index: (req, res) => {
    res.render("home", { title: "In Memoriam Brasil" })
  },

  criarMemorial: (req, res) => {
    const { nome, sobrenome } = req.body

    if (!nome || !sobrenome) {
      return res.status(400).send("Nome e sobrenome são obrigatórios!")
    }

    const nomeSobrenome = `${nome}-${sobrenome}`
      .toLowerCase()
      .replace(/\s+/g, "-")

    const memorialPath = path.join(
      __dirname,
      "../views/memoriais",
      `${nomeSobrenome}.hbs`
    )

    // Criar conteúdo dinâmico para a página do homenageado
    const memorialContent = `
            <main class="container my-5">
                <div class="bg-white p-4 text-center">
                    <h1>Memorial de ${nome} ${sobrenome}</h1>
                    <p>Homenagem a ${nome} ${sobrenome}.</p>
                </div>
            </main>
        `

    // Salvar a página como um novo arquivo
    fs.writeFile(memorialPath, memorialContent, (err) => {
      if (err) {
        console.error("Erro ao criar memorial:", err)
        return res.status(500).send("Erro ao criar memorial.")
      }

      // Redirecionar para a nova página criada
      return res.redirect(`/${nomeSobrenome}`)
    })
  },

  exibirMemorial: (req, res) => {
    const nomeSobrenome = req.params.nomeSobrenome
    const memorialPath = path.join(
      __dirname,
      "../views/memoriais",
      `${nomeSobrenome}.hbs`
    )

    // Verifica se o arquivo do memorial existe
    if (fs.existsSync(memorialPath)) {
      return res.render(`memoriais/${nomeSobrenome}`, {
        layout: "memorial-layout",
      })
    } else {
      return res.status(404).render("404")
    }
  },
}

module.exports = HomeController
