const mongoose = require("mongoose")
const connectDB = require("./config/db")
const User = require("./app/models/User")
const Memorial = require("./app/models/Memorial")
const Gallery = require("./app/models/Gallery")

connectDB()

const seedDatabase = async () => {
  try {
    await User.deleteMany()
    await Memorial.deleteMany()
    await Gallery.deleteMany()

    const user = await User.create({
      firstName: "João",
      lastName: "Silva",
      email: "joao@email.com",
      password: "123456",
    })

    const memorial = await Memorial.create({
      user: user._id,
      firstName: "Maria",
      lastName: "Silva",
      slug: "maria-silva",
      gender: "Feminino",
      relationship: "Mãe",
      birth: {
        date: "1950-05-12",
        city: "São Paulo",
        state: "SP",
        country: "Brasil",
      },
      death: {
        date: "2020-08-30",
        city: "Rio de Janeiro",
        state: "RJ",
        country: "Brasil",
      },
      about: "Maria foi uma mãe amorosa...",
      tribute: [{ name: "Carlos", message: "Saudades eternas" }],
      lifeStory:
        "Ela nasceu em São Paulo e teve uma vida dedicada à família...",
      stories: [
        { name: "José", story: "Lembro-me de quando viajamos juntos..." },
      ],
      theme: "blue-theme",
    })

    await Gallery.create({
      memorial: memorial._id,
      photos: ["photo1.jpg", "photo2.jpg"],
      videos: ["video1.mp4"],
      audios: ["audio1.mp3"],
    })

    console.log("Banco de dados populado!")
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seedDatabase()
