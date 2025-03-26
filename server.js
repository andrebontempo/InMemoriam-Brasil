const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")
const conectarDB = require("./config/db")
const session = require("express-session")
const formData = require("express-form-data")
const setUserMiddleware = require("./app/middlewares/setUserMiddleware")
require("dotenv").config()
const methodOverride = require("method-override")

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

//Método adicionado para o formulário usar o PUT - sem isto só aceita POST
app.use(methodOverride("_method"))

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
  helpers: {
    formatDate: function (date, format) {
      if (!date || isNaN(new Date(date))) return "Data inválida"

      const data = new Date(date)

      if (format === "year") {
        return data.getFullYear()
      }

      const options = { year: "numeric", month: "long", day: "numeric" }
      return data.toLocaleDateString("pt-BR", options)
    }, //Formata a data para ser usada em qualquer lugar do sistema

    eq: (a, b) => a === b, // Função de comparação

    ifEquals: function (a, b, options) {
      if (a === b) {
        return options.fn(this) // Executa o bloco "true"
      }
      return options.inverse(this) // Executa o bloco "false"
    }, //Corrige o erro na hora de editar o Memorial.
  },
  cache: process.env.NODE_ENV === "production", // Habilita cache apenas em produção
})

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
