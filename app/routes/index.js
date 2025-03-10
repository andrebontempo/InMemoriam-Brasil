const express = require("express")
const router = express.Router()
const HomeController = require("../controllers/HomeController")
const AuthController = require("../controllers/AuthController")
const MemorialController = require("../controllers/MemorialController")
const authMiddleware = require("../middlewares/authMiddleware")

// Rotas de Autenticação
//router.post("/login", AuthController.login)

// Rotas de Memoriais
//router.post("/memorials", MemorialController.createMemorial)

// Rotas do site principal
router.get("/", HomeController.index)

//router.get("/login", AuthController.login)
// Rota do botão login
//router.get("/login", (req, res) => {
//  res.render("login", { title: "Login" })
//})

// Rota para exibir o formulário de cadastro
router.get("/register", AuthController.showRegisterForm)
// Rota para processar o cadastro
router.post("/register", AuthController.registerUser)
// Rota para exibir o formulário de login
router.get("/login", AuthController.showLoginForm)
// Rota para processar o login
router.post("/login", AuthController.loginUser)

router.get("/dashboard", authMiddleware, (req, res) => {
  res.render("dashboard", { user: req.session.user })
})
router.get("/logout", AuthController.logout)

// Novas rotas
router.get("/sobre", (req, res) => {
  res.render("sobre", { title: "Sobre Nós - In Memoriam Brasil" })
})

router.get("/criar-memorial", (req, res) => {
  res.render("criar-memorial", { title: "Criar Memorial - In Memoriam Brasil" })
})

router.get("/plano-opcoes", (req, res) => {
  res.render("plano-opcoes", { title: "Plano e Opções - In Memoriam Brasil" })
})
/*
// Rota comentada (pode ser ativada no futuro)
router.get("/testemunhos", (req, res) => {
  res.render("testemunhos", { title: "Testemunhos - In Memoriam Brasil" });
});
*/
router.get("/contato", (req, res) => {
  res.render("contato", { title: "Contato - In Memoriam Brasil" })
})
// Novas rotas para os links do rodapé
router.get("/memoriais-virtuais", (req, res) => {
  res.render("memoriais-virtuais", {
    title: "Memoriais Virtuais - In Memoriam Brasil",
  })
})
router.get("/condicoes-utilizacao", (req, res) => {
  res.render("condicoes-utilizacao", {
    title: "Condições de Utilização - In Memoriam Brasil",
  })
})
router.get("/politica-privacidade", (req, res) => {
  res.render("politica-privacidade", {
    title: "Política de Privacidade - In Memoriam Brasil",
  })
})
router.get("/mapa-site", (req, res) => {
  res.render("mapa-site", { title: "Mapa do Site - In Memoriam Brasil" })
})

router.post("/criar-memorial", MemorialController.criarMemorial)

//router.get("/memorial/:nomeSobrenome", MemorialController.exibirMemorial)
router.get("/memoriais/:nomeSobrenome", (req, res) => {
  res.redirect(`/memoriais/${req.params.nomeSobrenome}/about`)
})
router.get("/memoriais/:nomeSobrenome/about", MemorialController.exibirMemorial)
router.get("/memoriais/:slug/lifestory", MemorialController.exibirLifeStory)
// Rota de pesquisa
router.get("/pesquisa", MemorialController.pesquisarMemorial)

// Rota para páginas não encontradas (404)
router.use((req, res) => {
  res
    .status(404)
    .render("404", { title: "Página Não Encontrada", layout: false })
})

module.exports = router
