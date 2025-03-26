module.exports = (req, res, next) => {
  if (!req.session.loggedUser) {
    /*
    console.log(
      "Middleware de autenticação: Nenhum usuário logado. Redirecionando para /auth/login."
    )
    */
    // Salvar a URL original para redirecionamento após login
    //req.session.returnTo = req.originalUrl
    //req.session.returnTo = "/criar-memorial"

    //req.session.returnTo = "/criar-memorial"
    //req.session.returnTo = req.originalUrl
    //req.session.formData = req.body

    return res.redirect("/auth/login")
  }

  /*
  console.log(
    "Middleware de autenticação: Usuário autenticado ->"
    //req.session.loggedUser
  )
  */
  next()
}
