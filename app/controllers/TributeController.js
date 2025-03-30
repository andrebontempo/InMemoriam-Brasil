const Tribute = require("../models/Tribute") // Ajuste o caminho conforme necessário
const mongoose = require("mongoose")

const TributeController = {
  // Exibir o formulário de cadastro
  createTribute: async (req, res) => {
    // Garantir que o usuário autenticado esteja presente
    const userCurrent = req.session.loggedUser
    try {
      //console.log(req.body)
      // Verifique se 'memorial' está no corpo da requisição
      if (!req.body.memorial) {
        return res.status(400).send("Memorial ID não fornecido.")
      }

      const memorialId = req.body.memorial // Pegue o ID do memorial
      const { type, message, slug } = req.body // Tipo e mensagem do tributo

      // Criação do novo tributo
      const newTribute = new Tribute({
        memorial: memorialId,
        type: type,
        message: message,
        name: "Nome do Tributo",
        user: new mongoose.Types.ObjectId(userCurrent._id),
        //name: req.user.firstName + " " + req.user.lastName, // Nome do usuário logado
      })

      // Salve o tributo no banco de dados
      await newTribute.save()

      // Redirecione de volta para o memorial
      res.redirect(`/memorial/${slug}`)
    } catch (err) {
      console.error(err)
      res.status(500).send("Erro ao criar tributo")
    }
  },
}

module.exports = TributeController
