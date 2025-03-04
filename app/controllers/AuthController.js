const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//exports.register = async (req, res) => {
exports.login = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: "E-mail já registrado" })

    const hashedPassword = await bcrypt.hash(password, 10)

    user = new User({ firstName, lastName, email, password: hashedPassword })
    await user.save()

    res.status(201).json({ message: "Usuário registrado com sucesso" })
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor" })
  }
}
