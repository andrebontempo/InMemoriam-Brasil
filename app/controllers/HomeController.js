const HomeController = {
  index: (req, res) => {
    res.render("statics/home", { title: "In Memoriam Brasil" })
  },
}

module.exports = HomeController
