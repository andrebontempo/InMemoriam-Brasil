const mongoose = require("mongoose")
const User = require("./app/models/User")
const Memorial = require("./app/models/Memorial")
const Tribute = require("./app/models/Tribute")
const LifeStory = require("./app/models/LifeStory")
const Story = require("./app/models/Story")
const Gallery = require("./app/models/Gallery")

async function seedDatabase() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(
      "mongodb+srv://andrelnx:A2345678@cluster000.h5t9m.mongodb.net/inmemoriambrasilBD", // Substitua pelo seu URI
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    console.log("✅ Conectado ao MongoDB")

    // Limpar o banco de dados antes de popular
    await User.deleteMany({})
    await Memorial.deleteMany({})
    await Tribute.deleteMany({})
    await LifeStory.deleteMany({})
    await Story.deleteMany({})
    await Gallery.deleteMany({})
    console.log("🗑️ Banco de dados limpo")

    // Criar usuários
    const user1 = await User.create({
      firstName: "Mariana",
      lastName: "Souza",
      email: "mariana@email.com",
      password: "123456", // Exemplo de senha criptografada
      avatar: "/images/default-avatar.png",
      authProvider: "local",
      role: "user",
    })

    const user2 = await User.create({
      firstName: "Carlos",
      lastName: "Silva",
      email: "carlos@email.com",
      password: "123456", // Exemplo de senha criptografada
      avatar: "/images/default-avatar.png",
      authProvider: "local",
      role: "user",
    })

    console.log("👥 Usuários criados")

    // Criar memoriais e associar ao user com informações de nascimento e falecimento
    const memorial1 = await Memorial.create({
      firstName: "Pateta",
      lastName: "Pereira",
      slug: "pateta-pereira",
      kinship: "Avô",
      mainPhoto: { url: "/images/uploads/pateta.png" },
      user: user1._id, // Associar ao segundo usuário
      birth: {
        date: new Date("1984-07-25"),
        city: "Carmo do Paranaíba",
        state: "MG",
        country: "Brasil",
      },
      death: {
        date: new Date("2021-05-15"),
        city: "Rio de Janeiro",
        state: "RJ",
        country: "Brasil",
      },
    })

    const memorial2 = await Memorial.create({
      firstName: "Olivia",
      lastName: "Palito",
      slug: "olivia-palito",
      kinship: "Tia",
      mainPhoto: { url: "/images/uploads/olivia.png" },
      user: user2._id, // Associar ao primeiro usuário
      birth: {
        date: new Date("1970-04-12"),
        city: "São Paulo",
        state: "SP",
        country: "Brasil",
      },
      death: {
        date: new Date("2020-02-01"),
        city: "São Paulo",
        state: "SP",
        country: "Brasil",
      },
    })

    const memorial3 = await Memorial.create({
      firstName: "Mickey",
      lastName: "Oliveira",
      slug: "mickey-oliveira",
      kinship: "Irmão",
      mainPhoto: { url: "/images/uploads/mickey.png" },
      user: user1._id, // Associar ao primeiro usuário
      birth: {
        date: new Date("1975-01-05"),
        city: "Belo Horizonte",
        state: "MG",
        country: "Brasil",
      },
      death: {
        date: new Date("2019-10-30"),
        city: "Araxá",
        state: "MG",
        country: "Brasil",
      },
    })

    const memorial4 = await Memorial.create({
      firstName: "Mulher",
      lastName: "Maravilha",
      slug: "mulher-maravilha",
      kinship: "Prima",
      mainPhoto: { url: "/images/uploads/mulher.png" },
      user: user2._id, // Associar ao segundo usuário
      birth: {
        date: new Date("1990-03-22"),
        city: "Curitiba",
        state: "PR",
        country: "Brasil",
      },
      death: {
        date: new Date("2022-11-11"),
        city: "Porto Alegre",
        state: "RS",
        country: "Brasil",
      },
    })

    console.log("🗃️ Memorials criados")

    // Criar tributos para cada memorial
    const createTributes = async (memorial, user) => {
      for (let i = 1; i <= 3; i++) {
        await Tribute.create({
          memorial: memorial._id,
          user: user._id,
          name: `${user.firstName} ${user.lastName} - Homenagem ${i}`,
          message: `Esta é a homenagem número ${i} para ${memorial.firstName}.`,
          type: "tributo_caneta.png",
          image: `/images/tribute${i}.jpg`,
        })
      }
    }

    await createTributes(memorial1, user2)
    await createTributes(memorial2, user1)
    await createTributes(memorial3, user1)
    await createTributes(memorial4, user2)

    console.log("🎖️ Tributos criados")

    // Criar LifeStories para cada memorial
    const createLifeStory = async (memorial, user) => {
      await LifeStory.create({
        memorial: memorial._id,
        user: user._id,
        title: `História de vida de ${memorial.firstName}`,
        content: `${memorial.firstName} teve uma vida maravilhosa, repleta de momentos inesquecíveis.`,
        images: [`/images/lifeStory-${memorial.slug}.jpg`],
      })
    }

    await createLifeStory(memorial1, user2)
    await createLifeStory(memorial2, user1)
    await createLifeStory(memorial3, user1)
    await createLifeStory(memorial4, user2)

    console.log("📖 LifeStories criados")

    // Criar Stories para cada memorial
    const createStory = async (memorial, user) => {
      await Story.create({
        memorial: memorial._id,
        user: user._id,
        name: `${user.firstName} ${user.lastName}`,
        title: `A história de ${memorial.firstName}`,
        content: `${memorial.firstName} foi uma pessoa incrível que tocou o coração de todos ao seu redor.`,
        images: [`/images/story-${memorial.slug}.jpg`],
      })
    }

    await createStory(memorial1, user2)
    await createStory(memorial2, user1)
    await createStory(memorial3, user1)
    await createStory(memorial4, user2)

    console.log("📜 Stories criados")

    // Criar Gallery para cada memorial
    const createGallery = async (memorial, user) => {
      await Gallery.create({
        memorial: memorial._id,
        user: user._id,
        photos: [`/images/gallery-${memorial.slug}.jpg`],
        audios: [`/audio/tribute-${memorial.slug}.mp3`],
        videos: [`/video/tribute-${memorial.slug}.mp4`],
      })
    }

    await createGallery(memorial1, user2)
    await createGallery(memorial2, user1)
    await createGallery(memorial3, user1)
    await createGallery(memorial4, user2)

    console.log("📸 Galleries criadas")
  } catch (err) {
    console.error(err)
  } finally {
    mongoose.connection.close()
  }
}

seedDatabase()
