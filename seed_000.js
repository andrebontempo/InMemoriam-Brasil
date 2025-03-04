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

    const user1 = await User.create({
      firstName: "Ana",
      lastName: "Pereira",
      email: "ana@email.com",
      password: "123456",
    })

    const user2 = await User.create({
      firstName: "Carlos",
      lastName: "Santos",
      email: "carlos@email.com",
      password: "123456",
    })

    const user3 = await User.create({
      firstName: "Fernanda",
      lastName: "Lima",
      email: "fernanda@email.com",
      password: "123456",
    })

    const memorials = [
      {
        user: user1._id,
        firstName: "José",
        lastName: "Pereira",
        slug: "jose-pereira",
        gender: "Masculino",
        relationship: "Pai",
        birth: {
          date: "1945-02-10",
          city: "Belo Horizonte",
          state: "MG",
          country: "Brasil",
        },
        death: {
          date: "2015-06-20",
          city: "São Paulo",
          state: "SP",
          country: "Brasil",
        },
        about: "José era um homem incrível...",
        tribute: [
          { name: "Ana", message: "Sempre estará em nossos corações." },
        ],
        lifeStory: "José teve uma vida repleta de conquistas...",
        stories: [{ name: "Pedro", story: "José me ensinou a pescar..." }],
        theme: "green-theme",
      },
      {
        user: user2._id,
        firstName: "Luiza",
        lastName: "Santos",
        slug: "luiza-santos",
        gender: "Feminino",
        relationship: "Avó",
        birth: {
          date: "1930-09-25",
          city: "Curitiba",
          state: "PR",
          country: "Brasil",
        },
        death: {
          date: "2018-12-15",
          city: "Curitiba",
          state: "PR",
          country: "Brasil",
        },
        about: "Luiza foi uma avó amorosa...",
        tribute: [{ name: "Carlos", message: "Saudades eternas, vovó." }],
        lifeStory: "Uma vida cheia de histórias inspiradoras...",
        stories: [
          { name: "Mariana", story: "Vovó sempre fazia o melhor bolo!" },
        ],
        theme: "blue-theme",
      },
      {
        user: user3._id,
        firstName: "Ricardo",
        lastName: "Lima",
        slug: "ricardo-lima",
        gender: "Masculino",
        relationship: "Tio",
        birth: {
          date: "1965-07-15",
          city: "Recife",
          state: "PE",
          country: "Brasil",
        },
        death: {
          date: "2021-03-05",
          city: "Fortaleza",
          state: "CE",
          country: "Brasil",
        },
        about: "Ricardo era um aventureiro nato...",
        tribute: [
          { name: "Fernanda", message: "Nunca esqueceremos suas histórias." },
        ],
        lifeStory: "Uma jornada incrível pelo mundo...",
        stories: [
          { name: "João", story: "Ele sempre me levava para pescar..." },
        ],
        theme: "red-theme",
      },
    ]

    for (let memorialData of memorials) {
      const memorial = await Memorial.create(memorialData)
      await Gallery.create({
        memorial: memorial._id,
        photos: ["photo1.jpg", "photo2.jpg"],
        videos: ["video1.mp4"],
        audios: ["audio1.mp3"],
      })
    }

    console.log("Banco de dados populado com novos memoriais!")
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seedDatabase()
