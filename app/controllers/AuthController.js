const bcrypt = require("bcrypt") // Use a biblioteca bcrypt original
const User = require("../models/User")
//const jwt = require("jsonwebtoken")

const AuthController = {
  // Exibir o formulário de cadastro
  showRegisterForm: (req, res) => {
    res.render("register")
  },

  // Exibir o formulário de login
  showLoginForm: (req, res) => {
    res.render("login")
  },

  // Processar o login do usuário
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body

      // Verifica se o usuário existe
      //console.log("Email enviado:", email) // Verifique o valor do e-mail
      const user = await User.findOne({ email: email }) // Busca direta

      if (!user) {
        return res
          .status(400)
          .render("login", { error: "Usuário não cadastrado." })
      }

      //console.log("Usuário encontrado:", user) //Retorno da consulta no banco de dados

      // Verifica se a senha está correta
      const isMatch = await bcrypt.compare(password.trim(), user.password)
      //console.log(password, user.password)
      //console.log("Senha válida?", isMatch)

      if (!isMatch) {
        return res
          .status(400)
          .render("login", { error: "E-mail ou senha inválidos." })
      }

      // Armazena dados do usuário na sessão
      req.session.user = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }

      res.redirect("/dashboard") // Redireciona para o painel do usuário
    } catch (error) {
      console.error("Erro ao processar login:", error)
      res.status(500).render("login", { error: "Erro ao fazer login." })
    }
  },

  // Processar o logout do usuário
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login")
    })
  },

  // Processar o cadastro do usuário
  registerUser: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body

      // Verifica se o e-mail já está cadastrado
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.render("register", { error: "Usuário já cadastrado!" })
      }

      // Hash da senha está comentado pois está sendo realizado no model
      //const saltRounds = 10
      //const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Criar um novo usuário
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: password, // Senha sem hash (será criptografada no model)
        //password: hashedPassword, //adicionei a linh acima e comentei essa linha
        authProvider: "local",
      })

      await newUser.save()

      res.redirect("/login") // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error)
      res.status(500).render("register", { error: "Erro ao cadastrar usuário" })
    }
  },
}

module.exports = AuthController
