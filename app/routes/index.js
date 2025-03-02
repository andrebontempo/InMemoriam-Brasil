const express = require("express")
const router = express.Router()
const HomeController = require("../controllers/HomeController")
const AuthController = require("../controllers/AuthController")

// Rotas
router.get("/", HomeController.index)
router.get("/login", AuthController.login)

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
router.get("/testemunhos", (req, res) => {
  res.render("testemunhos", { title: "Testemunhos - In Memoriam Brasil" })
})
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

module.exports = router
