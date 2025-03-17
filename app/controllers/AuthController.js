const bcrypt = require("bcrypt") // Use a biblioteca bcrypt original
const User = require("../models/User")

const AuthController = {
  // Exibir o formulário de cadastro
  showRegisterForm: (req, res) => {
    res.render("auth/register")
  },

  // Exibir o formulário de login
  showLoginForm: (req, res) => {
    res.render("auth/login")
  },

  // Processar o login do usuário
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body

      // Verifica se o usuário existe
      const user = await User.findOne({ email: email }) // Busca direta

      if (!user) {
        return res
          .status(400)
          .render("auth/login", { error: "Usuário não cadastrado." })
      }

      // Verifica se a senha está correta
      const isMatch = await bcrypt.compare(password.trim(), user.password)

      if (!isMatch) {
        return res
          .status(400)
          .render("auth/login", { error: "E-mail ou senha inválidos." })
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
      res.status(500).render("auth/login", { error: "Erro ao fazer login." })
    }
  },

  // Processar o cadastro do usuário
  registerUser: async (req, res) => {
    try {
      const { firstName, lastName, email, password, confirmPassword } = req.body

      //console.log("Dados do formulário:", req.body)
      // Verifica se as senhas coincidem
      if (password !== confirmPassword) {
        return res.render("auth/register", {
          error: "As senhas não coincidem!",
          firstName,
          lastName,
          email,
        })
      }
      // Verifica se o e-mail já está cadastrado
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.render("auth/register", { error: "Usuário já cadastrado!" })
      }

      // Criar um novo usuário
      const newUser = new User({
        firstName,
        lastName,
        email,
        password, // A senha será criptografada no model com o middleware
        authProvider: "local",
      })

      // Salvar o usuário no banco de dados
      await newUser.save()

      //console.log("Usuário cadastrado com sucesso:", newUser)

      // Agora que o usuário foi registrado, vamos logá-lo automaticamente:
      // A autenticação será o mesmo processo que ocorre no login
      req.session.user = {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      }

      //console.log("Usuário autenticado e logado automaticamente")

      // Redireciona para o painel do usuário (dashboard)
      res.redirect("/dashboard")
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error)
      res
        .status(500)
        .render("auth/register", { error: "Erro ao cadastrar usuário" })
    }
  },

  // Processar o logout do usuário
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/")
    })
  },
}

module.exports = AuthController
