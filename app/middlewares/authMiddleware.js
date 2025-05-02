module.exports = (req, res, next) => {
  if (!req.session.loggedUser) {
    // Salvar a URL original para redirecionamento após login
    req.session.returnTo = req.originalUrl
    return res.redirect("/auth/login")
  }
  next()
}
