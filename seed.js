const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const User = require("./app/models/User")
const Memorial = require("./app/models/Memorial")

// Substitua pela string de conexão com seu MongoDB
const DB_URI =
  "mongodb+srv://andrelnx:A2345678@cluster000.h5t9m.mongodb.net/inmemoriambrasilBD" // Exemplo

// Função para popular o banco
async function seedDatabase() {
  try {
    // Conectar ao banco de dados MongoDB
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Conectado ao MongoDB")

    // Limpando coleções antes de adicionar dados
    await User.deleteMany({})
    await Memorial.deleteMany({})
    console.log("Coleções limpas")

    // Criando usuários
    const users = await User.create([
      {
        firstName: "Carlos",
        lastName: "Silva",
        email: "carlos.silva@example.com",
        password: "senha123",
        authProvider: "local",
      },
      {
        firstName: "Maria",
        lastName: "Oliveira",
        email: "maria.oliveira@example.com",
        password: "senha123",
        authProvider: "local",
      },
      {
        firstName: "João",
        lastName: "Pereira",
        email: "joao.pereira@example.com",
        password: "senha123",
        authProvider: "local",
      },
      {
        firstName: "Ana",
        lastName: "Costa",
        email: "ana.costa@example.com",
        password: "senha123",
        authProvider: "local",
      },
      {
        firstName: "Lucas",
        lastName: "Mendes",
        email: "lucas.mendes@example.com",
        password: "senha123",
        authProvider: "local",
      },
    ])
    console.log("Usuários criados")

    // Criando memoriais
    const memoriais = await Memorial.create([
      {
        firstName: "Carlos",
        lastName: "Silva",
        slug: "carlos-silva",
        gender: "Masculino",
        birth: {
          date: new Date("1980-05-20"),
          city: "São Paulo",
          state: "SP",
          country: "Brasil",
        },
        death: {
          date: new Date("2020-03-10"),
          city: "São Paulo",
          state: "SP",
          country: "Brasil",
        },
        epitaph: "Sempre será lembrado.",
        about: "Carlos era um homem de família e amigo leal.",
        tribute: [
          { name: "Maria", message: "Saudades, meu querido Carlos." },
          { name: "João", message: "Você fará muita falta." },
        ],
        lifeStory: [
          {
            title: "Infância",
            content: "Carlos teve uma infância feliz em São Paulo.",
          },
          {
            title: "Carreira",
            content:
              "Carlos se dedicou à engenharia durante toda sua carreira.",
          },
        ],
        stories: [
          {
            title: "Viagem para a Europa",
            content:
              "Carlos viajou para a Europa em 2015 e se apaixonou por Paris.",
          },
        ],
        gallery: {
          photos: ["photo1.jpg", "photo2.jpg"],
          audios: ["audio1.mp3", "audio2.mp3"],
          videos: ["video1.mp4", "video2.mp4"],
        },
        theme: "blue-theme",
        user: users[0]._id,
      },
      {
        firstName: "Maria",
        lastName: "Oliveira",
        slug: "maria-oliveira",
        gender: "Feminino",
        birth: {
          date: new Date("1975-07-14"),
          city: "Rio de Janeiro",
          state: "RJ",
          country: "Brasil",
        },
        death: {
          date: new Date("2021-09-05"),
          city: "Rio de Janeiro",
          state: "RJ",
          country: "Brasil",
        },
        epitaph: "Viveu com amor e alegria.",
        about: "Maria era uma pessoa doce e cheia de energia.",
        tribute: [
          {
            name: "Carlos",
            message: "Você fez a diferença na minha vida, Maria.",
          },
          { name: "Ana", message: "Descanse em paz, amiga querida." },
        ],
        lifeStory: [
          {
            title: "Juventude",
            content: "Maria foi uma jovem muito ativa na comunidade.",
          },
          {
            title: "Família",
            content: "Ela sempre colocou sua família em primeiro lugar.",
          },
        ],
        stories: [
          {
            title: "Casamento",
            content:
              "Maria e seu marido tiveram uma história de amor incrível.",
          },
        ],
        gallery: {
          photos: ["maria1.jpg", "maria2.jpg"],
          audios: ["maria1.mp3", "maria2.mp3"],
          videos: ["maria1.mp4", "maria2.mp4"],
        },
        theme: "blue-theme",
        user: users[1]._id,
      },
      // Adicione mais memoriais conforme necessário
    ])

    console.log("Memoriais criados")

    // Fechar a conexão com o MongoDB
    await mongoose.disconnect()
    console.log("Banco de dados desconectado")
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error)
  }
}

// Rodar o script de seed
seedDatabase()
