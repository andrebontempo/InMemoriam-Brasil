module.exports = (req, res, next) => {
  res.locals.user = req.session.user || null // Define `user` globalmente para todas as views
  next()
}
