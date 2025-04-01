const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")
const conectarDB = require("./config/db")
const session = require("express-session")
const formData = require("express-form-data")
const setUserMiddleware = require("./app/middlewares/setUserMiddleware")
require("dotenv").config()
const methodOverride = require("method-override")
const helpers = require("./app/utils/helpers") // Importa os helpers externos

const moment = require("moment-timezone")
// Configura o idioma para português
moment.locale("pt-br")

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

// Aplicar o middleware global para disponibilizar `loggedUser` em todas as views
app.use(setUserMiddleware)

// Método adicionado para o formulário usar o PUT - sem isto só aceita POST
//app.use(methodOverride("_method"))
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      return req.body._method
    }
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
    path.join(__dirname, "app/views/partials/main"), // Partials para home e páginas que não são de memoriais
    path.join(__dirname, "app/views/partials/memorial"), // Partials específicas de memoriais
  ],
  helpers, // Usa os helpers externos do arquivo utils/helpers.js
  cache: process.env.NODE_ENV === "production", // Habilita cache apenas em produção
})

// Configurar o Handlebars como motor de template
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
