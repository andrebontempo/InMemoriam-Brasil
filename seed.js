const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const User = require("./app/models/User")
const Memorial = require("./app/models/Memorial")

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://andrelnx:A2345678@cluster000.h5t9m.mongodb.net/inmemoriambrasilBD",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )

    console.log("📌 Conectado ao MongoDB.")

    // 🔥 Apaga dados antigos antes de inserir os novos
    await User.deleteMany({})
    await Memorial.deleteMany({})
    console.log("🗑️ Dados antigos removidos.")

    // 📌 Criando usuários de teste
    const users = [
      {
        firstName: "Alice",
        lastName: "Silva",
        email: "alice@example.com",
        password: await bcrypt.hash("123456", 10),
        authProvider: "local",
      },
      {
        firstName: "Bruno",
        lastName: "Pereira",
        email: "bruno@example.com",
        password: await bcrypt.hash("654321", 10),
        authProvider: "local",
      },
      {
        firstName: "Carlos",
        lastName: "Oliveira",
        email: "carlos@example.com",
        googleId: "1234567890abcdef",
        authProvider: "google",
      },
      {
        firstName: "Daniela",
        lastName: "Santos",
        email: "daniela@example.com",
        password: await bcrypt.hash("daniela123", 10),
        authProvider: "local",
      },
      {
        firstName: "Eduardo",
        lastName: "Fernandes",
        email: "eduardo@example.com",
        googleId: "abcdef1234567890",
        authProvider: "google",
      },
    ]

    const insertedUsers = await User.insertMany(users)
    console.log("✅ Usuários inseridos com sucesso!")

    // 📌 Criando memoriais de teste
    const memorials = [
      {
        user: insertedUsers[0]._id,
        firstName: "João",
        lastName: "Silva",
        slug: "joao-silva",
        gender: "male",
        relationship: "Pai",
        birth: {
          date: "1950-05-20",
          city: "São Paulo",
          state: "SP",
          country: "Brasil",
        },
        death: {
          date: "2020-08-15",
          city: "Rio de Janeiro",
          state: "RJ",
          country: "Brasil",
        },
        epitaph: "Sempre em nossos corações.",
        about: "João foi um grande amigo e pai amoroso.",
        gallery: [
          {
            type: "image",
            url: "/uploads/joao-foto.jpg",
            description: "Foto de João",
          },
        ],
      },
      {
        user: insertedUsers[1]._id,
        firstName: "Ana",
        lastName: "Pereira",
        slug: "ana-pereira",
        gender: "female",
        relationship: "Mãe",
        birth: {
          date: "1960-02-10",
          city: "Curitiba",
          state: "PR",
          country: "Brasil",
        },
        death: {
          date: "2018-11-22",
          city: "Porto Alegre",
          state: "RS",
          country: "Brasil",
        },
        epitaph: "Sua luz brilhará para sempre.",
        about: "Ana sempre ajudou quem precisava.",
        gallery: [
          {
            type: "video",
            url: "/uploads/ana-video.mp4",
            description: "Homenagem",
          },
        ],
      },
      {
        user: insertedUsers[2]._id,
        firstName: "Marcos",
        lastName: "Oliveira",
        slug: "marcos-oliveira",
        gender: "male",
        relationship: "Avô",
        birth: {
          date: "1945-07-10",
          city: "Belo Horizonte",
          state: "MG",
          country: "Brasil",
        },
        death: {
          date: "2015-03-05",
          city: "São Paulo",
          state: "SP",
          country: "Brasil",
        },
        epitaph: "Seu legado nunca será esquecido.",
        about: "Marcos foi um grande professor e escritor.",
        gallery: [
          {
            type: "audio",
            url: "/uploads/marcos-voz.mp3",
            description: "Mensagem",
          },
        ],
      },
      {
        user: insertedUsers[3]._id,
        firstName: "Beatriz",
        lastName: "Santos",
        slug: "beatriz-santos",
        gender: "female",
        relationship: "Avó",
        birth: {
          date: "1938-09-25",
          city: "Recife",
          state: "PE",
          country: "Brasil",
        },
        death: {
          date: "2019-12-31",
          city: "Fortaleza",
          state: "CE",
          country: "Brasil",
        },
        epitaph: "O amor é eterno.",
        about: "Beatriz sempre trouxe alegria para todos ao seu redor.",
        gallery: [
          {
            type: "image",
            url: "/uploads/beatriz.jpg",
            description: "Beatriz sorrindo",
          },
        ],
      },
      {
        user: insertedUsers[4]._id,
        firstName: "Ricardo",
        lastName: "Fernandes",
        slug: "ricardo-fernandes",
        gender: "male",
        relationship: "Tio",
        birth: {
          date: "1975-12-15",
          city: "Salvador",
          state: "BA",
          country: "Brasil",
        },
        death: {
          date: "2022-06-18",
          city: "Brasília",
          state: "DF",
          country: "Brasil",
        },
        epitaph: "Descanse em paz, guerreiro.",
        about: "Ricardo foi um grande amigo e irmão.",
        gallery: [
          {
            type: "video",
            url: "/uploads/ricardo-homenagem.mp4",
            description: "Última homenagem",
          },
        ],
      },
    ]

    await Memorial.insertMany(memorials)
    console.log("✅ Memoriais inseridos com sucesso!")

    // 🚀 Finaliza a conexão
    mongoose.connection.close()
    console.log("🔌 Conexão com o banco fechada.")
  } catch (error) {
    console.error("❌ Erro ao popular o banco:", error)
    mongoose.connection.close()
  }
}

// Executa a função para popular o banco
seedDatabase()
