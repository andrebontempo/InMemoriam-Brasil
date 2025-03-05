const express = require("express")
const path = require("path")
const exphbs = require("express-handlebars")
const app = express()
const routes = require("../app/routes")

// Configurações do Handlebars
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: ".hbs",
  partialsDir: path.join(__dirname, "app/views/partials"),
  layoutsDir: path.join(__dirname, "app/views/layouts"),
})

app.engine(".hbs", hbs.engine)
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "app/views"))

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")))

// Rotas
app.use("/", routes)

// Rota dinâmica para os sites dos usuários
app.get("/:nome", (req, res) => {
  const nome = req.params.nome
  const background = "/images/background1.jpg" // Exemplo de background
  res.render("user", {
    title: `Página de ${nome}`,
    nome: nome,
    background: background,
    layout: "memorial-layout", // Usa o layout específico para os sites dos usuários
  })
})

// Iniciar servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
