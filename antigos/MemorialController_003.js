const Memorial = require("../app/models/Memorial")

exports.createMemorial = async (req, res) => {
  try {
    const { firstName, lastName, gender, relationship, birth, death, about } =
      req.body
    const slug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(
      /\s+/g,
      "-"
    )

    const memorial = new Memorial({
      user: req.user.id,
      firstName,
      lastName,
      slug,
      gender,
      relationship,
      birth,
      death,
      about,
    })

    await memorial.save()
    res.status(201).json({ message: "Memorial criado com sucesso", memorial })
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar memorial" })
  }
}
