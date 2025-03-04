const HomeController = {
  index: (req, res) => {
    res.render("home", { title: "In Memoriam Brasil" })
  },
}

module.exports = HomeController
