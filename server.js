const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")
const conectarDB = require("./config/db")
const session = require("express-session")
const formData = require("express-form-data")
require("dotenv").config()

const app = express()
conectarDB() // Conectar ao banco de dados

app.use(express.urlencoded({ extended: true })) // Para processar POST forms
app.use(express.json()) // Para processar JSON
app.use(formData.parse()) // Para lidar com uploads corretamente

// Configurar sessões
app.use(
  session({
    secret: "seuSegredoSuperSeguro",
    resave: false,
    saveUninitialized: false,
  })
)

// Importar rotas
const routes = require("./app/routes")

// Configurações do Handlebars

const hbs = exphbs.create({
  defaultLayout: "main", // Define o layout principal
  extname: "hbs", // Extensão padrão para os templates Handlebars
  layoutsDir: path.join(__dirname, "app/views/layouts"), // Diretório de layouts
  partialsDir: [
    path.join(__dirname, "app/views/partials"), // Partials globais
    //path.join(__dirname, "app/views/memorial-partials"), // Partials específicas de usuários
  ],
  helpers: {
    formatDate: function (date) {
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(date).toLocaleDateString("pt-BR", options)
    },
  },
  cache: process.env.NODE_ENV === "production", // Habilita cache apenas em produção
})

/*
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  layoutsDir: path.join(__dirname, "app/views/layouts"),
  partialsDir: [
    path.join(__dirname, "app/views/partials"),
    path.join(__dirname, "app/views/memorial-partials"),
  ],
  cache: false, // Desativa o cache para evitar erros de carregamento
})


const hbs = exphbs.create({
  defaultLayout: "main", // Layout padrão do site principal
  extname: ".hbs", // Extensão dos arquivos Handlebars
  partialsDir: [
    path.join(__dirname, "app/views/partials"), // Partials do site principal
    path.join(__dirname, "app/views/memorial-partials") // Partials dos sites dos usuários
  ],
  layoutsDir: path.join(__dirname, "app/views/layouts"), // Pasta de layouts
})
*/
app.engine(".hbs", hbs.engine)
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "app/views"))

// Middlewares
app.use(express.static(path.join(__dirname, "public"))) // Arquivos estáticos (CSS, JS, imagens)

// Usar rotas
app.use("/", routes)

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("500", { title: "Erro no Servidor", layout: false })
})

// Iniciar servidor
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
