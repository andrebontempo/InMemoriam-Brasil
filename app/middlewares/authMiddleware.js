// app/middlewares/authMiddleware.js

module.exports = (req, res, next) => {
  if (req.session.loggedUser) {
    return next()
  }

  // Salva a URL original para redirecionar após login
  req.session.redirectTo = req.originalUrl

  // Se for POST e tiver dados do formulário, armazena na sessão
  if (req.method === "POST") {
    req.session.formDataStep1 = req.body
  }

  res.redirect("/auth/login")
}
