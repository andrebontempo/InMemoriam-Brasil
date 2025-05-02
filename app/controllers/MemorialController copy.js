const Memorial = require("../models/Memorial")
const User = require("../models/User")
const Tribute = require("../models/Tribute") // Ajuste o caminho conforme necessário
const LifeStory = require("../models/LifeStory")
const SharedStory = require("../models/SharedStory")
const Gallery = require("../models/Gallery")
const path = require("path")
const fs = require("fs")
const { Console } = require("console")
const mongoose = require("mongoose")
const moment = require("moment-timezone")
const { calcularIdade } = require("../utils/helpers")
const MailService = require("../services/MailService")

const MemorialController = {
  renderStep1: (req, res) => {
    res.render("memorial/create-step1") // Renderiza a view do passo 1 (Nome e Sobrenome)
  },
  createStep1: async (req, res) => {
    // console.log("Usuário logado:", req.session.loggedUser)
    // console.log("Corpo da requisição recebido:", req.body)

    const userCurrent = req.session.loggedUser
    const { firstName, lastName } = req.body

    if (!userCurrent) {
      return res.redirect("/login")
    }

    if (!req.session.memorial) req.session.memorial = {}

    req.session.memorial.firstName = firstName
    req.session.memorial.lastName = lastName

    res.redirect("/memorial/create-step2")
  },
  renderStep2: (req, res) => {
    res.render("memorial/create-step2") // Renderiza a view do passo 2 (Dados de Nascimento e Falecimento)
  },
  createStep2: async (req, res) => {
    const { gender, kinship, birth, death } = req.body

    // Ajusta o objeto `birth` garantindo valores padrões
    const birth1 = {
      date: req.body["birth.date"] || null,
      city: req.body["birth.city"] || "Local desconhecido",
      state: req.body["birth.state"] || "Estado não informado",
      country: req.body["birth.country"] || "País não informado",
    }

    // Ajusta o objeto `death` garantindo valores padrões
    const death1 = {
      date: req.body["death.date"] || null,
      city: req.body["death.city"] || "Local desconhecido",
      state: req.body["death.state"] || "Estado não informado",
      country: req.body["death.country"] || "País não informado",
    }

    // Ajusta a galeria para garantir um array mesmo que esteja vazio
    const gallery = {
      photos: req.body["gallery.photos"] ? [req.body["gallery.photos"]] : [],
      audios: req.body["gallery.audios"] ? [req.body["gallery.audios"]] : [],
      videos: req.body["gallery.videos"] ? [req.body["gallery.videos"]] : [],
    }

    if (!req.session.memorial) {
      return res.redirect("/memorial/create-step1")
    }

    req.session.memorial.gender = gender
    req.session.memorial.kinship = kinship
    req.session.memorial.birth = birth1
    req.session.memorial.death = death1

    res.redirect("/memorial/create-step3")
  },
  renderStep3: (req, res) => {
    if (!req.session.memorial) {
      return res.redirect("/memorial/create-step1")
    }
    res.render("memorial/create-step3")
  },
  createStep3: async (req, res) => {
    try {
      const { plan } = req.body
      const memorialData = req.session.memorial
      const user = req.session.loggedUser

      if (!memorialData || !user) {
        return res.redirect("/memorial/create-step1")
      }

      // Gera o slug baseado no nome e sobrenome
      const slug = `${memorialData.firstName}-${memorialData.lastName}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/ç/g, "c")
        .replace(/\s+/g, "-")

      memorialData.plan = plan
      memorialData.user = user._id
      memorialData.slug = slug

      // ✅ Corrigir mainPhoto se for string
      if (typeof memorialData.mainPhoto === "string") {
        memorialData.mainPhoto = {
          url: memorialData.mainPhoto,
          //originalName: "foto-sem-nome.jpg", // opcional
        }
      }

      console.log("DADOS do memorial:", memorialData)

      // Salvar memorial no banco
      const newMemorial = await Memorial.create(memorialData)

      // Atualizar sessão
      req.session.memorialId = newMemorial._id
      req.session.memorialSlug = newMemorial.slug
      req.session.memorial = null // limpa os dados temporários

      res.redirect("/memorial/create-step4")
    } catch (err) {
      console.error("Erro ao salvar memorial:", err)
      res.status(500).render("error", {
        message: "Erro ao criar memorial. Tente novamente.",
      })
    }
  },
  renderStep4: (req, res) => {
    if (!req.session.memorialId) {
      return res.redirect("/memorial/create-step1")
    }
    //res.render("memorial/create-step4")
    res.render("memorial/create-step4", {
      memorialId: req.session.memorialId,
      slug: req.session.memorialSlug, // <--- AQUI
    })
  },
  createStep4: async (req, res) => {
    try {
      console.log("Dados do memorial:", req.session.memorial)
      console.log("Dados do memorialId:", req.session.memorialId)
      console.log("Dados do memorialSlug:", req.session.memorialSlug)
      const { epitaph, theme } = req.body
      const { memorialId, memorialSlug } = req.session
      const file = req.file

      if (!memorialId || !file) {
        return res.redirect("/memorial/create-step1")
      }
      // Atualizar a mainPhoto no memorial
      updateData.mainPhoto = {
        url: req.file.filename,
        updatedAt: new Date(),
      }
      //const photoFileName = file.filename

      await Memorial.findByIdAndUpdate(memorialId, {
        epitaph,
        theme,
        mainPhoto,
      })

      res.redirect(`/memorial/${memorialSlug}`)
    } catch (err) {
      console.error("Erro na etapa 4:", err)
      res.status(500).render("error", {
        message: "Erro ao personalizar memorial. Tente novamente.",
      })
    }
  },
  createMemorial: async (req, res) => {
    //console.log("Usuário logado:", req.session.loggedUser) // Exibe o usuário autenticado no console
    //console.log("Corpo da requisição recebido:", req.body) //  Verifica os dados enviados

    const userCurrent = req.session.loggedUser
    const { firstName, lastName, gender, kinship } = req.body

    // Ajusta o objeto `birth` garantindo valores padrões
    const birth = {
      date: req.body["birth.date"] || null,
      city: req.body["birth.city"] || "Local desconhecido",
      state: req.body["birth.state"] || "Estado não informado",
      country: req.body["birth.country"] || "País não informado",
    }

    // Ajusta o objeto `death` garantindo valores padrões
    const death = {
      date: req.body["death.date"] || null,
      city: req.body["death.city"] || "Local desconhecido",
      state: req.body["death.state"] || "Estado não informado",
      country: req.body["death.country"] || "País não informado",
    }

    // Ajusta a galeria para garantir um array mesmo que esteja vazio
    const gallery = {
      photos: req.body["gallery.photos"] ? [req.body["gallery.photos"]] : [],
      audios: req.body["gallery.audios"] ? [req.body["gallery.audios"]] : [],
      videos: req.body["gallery.videos"] ? [req.body["gallery.videos"]] : [],
    }

    // Verifica se nome e sobrenome foram informados
    if (!firstName || !lastName) {
      return res.status(400).render("errors/400", {
        message: "Nome e sobrenome são obrigatórios!",
      })
    }

    // Gera o slug baseado no nome e sobrenome
    const slug = `${firstName}-${lastName}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ç/g, "c")
      .replace(/\s+/g, "-")

    // Verifica se o memorial já existe
    try {
      const memorialExistente = await Memorial.findOne({ slug })
      if (memorialExistente) {
        return res.status(400).render("errors/400", {
          message: "Já existe um memorial com esse nome.",
        })
      }
      // Cria o memorial
      const memorial = new Memorial({
        user: userCurrent._id,
        firstName,
        lastName,
        slug,
        gender: gender, // || "Não informado",
        kinship: kinship, // || "Não informado",
        visibility: req.body.visibility || "public", // Usa o valor de visibilidade do formulário
        birth,
        death,
      })

      //console.log(memorial)
      await memorial.save()

      // Envia e-mail para o usuário
      await MailService.sendEmail({
        to: userCurrent.email,
        subject: "Seu memorial foi criado com sucesso",
        html: `
          <h1>Olá, ${userCurrent.firstName}</h1>
          <p>O memorial de <strong>${firstName} ${lastName}</strong> foi criado com sucesso.</p>
          <p>Você pode acessá-lo aqui: <a href="localhost:3000/memorial/${slug}">Ver memorial</a></p>
        `,
      })
      return res.redirect(`/memorial/${slug}/memorial-fet/edit`)
    } catch (error) {
      console.error("Erro ao criar memorial:", error)
      return res
        .status(500)
        .render("errors/500", { message: "Erro ao criar memorial." })
    }
  },

  // Método para exibir o memorial
  showMemorial: async (req, res) => {
    const { slug } = req.params
    try {
      const memorial = await Memorial.findOneAndUpdate(
        { slug },
        { $inc: { visits: 1 } },
        { new: true }
      )
        .populate({ path: "user", select: "firstName lastName" })
        .populate({ path: "lifeStory", select: "title content" })
        .populate({ path: "sharedStory", select: "title content" })
        .populate({ path: "gallery.photos", select: "url" })
        .populate({ path: "gallery.audios", select: "url" })
        .populate({ path: "gallery.videos", select: "url" })
        .lean() // somente depois do populate e update

      if (!memorial) {
        return res.status(404).render("errors/404", {
          message: "Memorial não encontrado.",
        })
      }

      // Buscar os tributos relacionados ao memorial
      const tributes = await Tribute.find({ memorial: memorial._id })
        .sort({ createdAt: -1 }) // 1 = crescente, -1 = decrescente
        .populate({ path: "user", select: "firstName lastName" }) // Aqui, populando o campo user com firstName e lastName
        .select("name message type image createdAt") // Selecionando campos específicos dos tributos
        .lean() // Garantir que o resultado seja simples (não um documento Mongoose)

      // Buscar as photos relacionados ao memorial
      const galeria = await Gallery.findOne({ memorial: memorial._id })
        .populate({ path: "user", select: "firstName lastName" })
        .select("photos audios videos")
        .lean() // Garantir que o resultado seja simples (não um documento Mongoose)

      const galleryData = galeria || {
        photos: [],
        audios: [],
        videos: [],
      }

      return res.render("memorial/memorial-about", {
        layout: "memorial-layout",
        user: {
          firstName: memorial.user.firstName || "Primeiro Nome Não informado",
          lastName: memorial.user.lastName || "Último Nome Não informado",
        },
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        slug: memorial.slug,
        id: memorial._id,
        gender: memorial.gender,
        kinship: memorial.kinship,
        mainPhoto: memorial.mainPhoto,
        tribute: tributes || [], // Passando os tributos para o template
        lifeStory: memorial.lifeStory || [], // Passando lifeStory para o template
        sharedStory: memorial.sharedStory || [], // Passando stories para o template
        gallery: galleryData,
        /*
        gallery: memorial.gallery || {
          photos: [],
          audios: [],
          videos: [],
        },
        */
        idade: calcularIdade(memorial.birth?.date, memorial.death?.date),
        birth: {
          date: memorial.birth?.date || "Não informada",
          city: memorial.birth?.city || "Local desconhecido",
          state: memorial.birth?.state || "Estado não informado",
          country: memorial.birth?.country || "País não informado",
        },
        death: {
          date: memorial.death?.date || "Não informada",
          city: memorial.death?.city || "Local desconhecido",
          state: memorial.death?.state || "Estado não informado",
          country: memorial.death?.country || "País não informado",
        },
        about: memorial.about,
        epitaph: memorial.epitaph, // || "",
        theme: memorial.theme, // || "blue-theme",
      })
    } catch (error) {
      console.error("Erro ao exibir memorial:", error)
      return res.status(500).render("errors/500", {
        message: "Erro ao exibir memorial.",
      })
    }
  },

  // Método para exibir a página de edição do memorial
  editMemorial: async (req, res) => {
    try {
      //console.log("Recebendo requisição para editar memorial:", req.params.slug)

      const memorial = await Memorial.findOne({ slug: req.params.slug })
        .populate({ path: "user", select: "firstName lastName" })
        .populate({ path: "lifeStory", select: "title content" }) // Populate para lifeStory
        .populate({ path: "sharedStory", select: "title content" }) // Populate para sharedstory
        .lean() // Converte o documento em um objeto simples

      if (!memorial) {
        //console.log("Nenhum memorial encontrado com este slug")
        return res.status(404).send("Memorial não encontrado")
      }

      // Buscar as photos relacionados ao memorial
      const galeria = await Gallery.findOne({ memorial: memorial._id })
        .populate({ path: "user", select: "firstName lastName" })
        .select("photos audios videos")
        .lean() // Garantir que o resultado seja simples (não um documento Mongoose)

      // Se não houver galeria, inicializa com arrays vazios
      const galleryData = {
        memorial: galeria?.memorial || null,
        user: galeria?.user || null,
        photos: galeria?.photos || [],
        audios: galeria?.audios || [],
        videos: galeria?.videos || [],
      }

      //console.log("Memorial encontrado:", memorial)
      //res.render("memorial/edit/personal", { memorial })
      return res.render("memorial/edit/memorial", {
        layout: "memorial-layout",
        firstName: memorial.firstName,
        lastName: memorial.lastName,
        slug: memorial.slug,
        gender: memorial.gender,
        mainPhoto: memorial.mainPhoto,
        kinship: memorial.kinship,
        birth: {
          date: memorial.birth?.date
            ? new Date(memorial.birth.date).toISOString().split("T")[0]
            : "",
          //date: memorial.birth?.date || "Não informada", // Passa a data sem formatar
          city: memorial.birth?.city || "Local desconhecido",
          state: memorial.birth?.state || "Estado não informado",
          country: memorial.birth?.country || "País não informado",
        },
        death: {
          date: memorial.death?.date
            ? new Date(memorial.death.date).toISOString().split("T")[0]
            : "",

          //date: memorial.death?.date || "Não informada", // Passa a data sem formatar
          city: memorial.death?.city || "Local desconhecido",
          state: memorial.death?.state || "Estado não informado",
          country: memorial.death?.country || "País não informado",
        },
        about: memorial.about, // || "Informação não disponível.",
        epitaph: memorial.epitaph, // || "Nenhum epitáfio fornecido.",
        //tribute: memorial.tribute || [], // Passando os tributos para o template
        //lifeStory: Array.isArray(memorial.lifeStory) ? memorial.lifeStory : [],
        //stories: Array.isArray(memorial.stories) ? memorial.stories : [],
        //gallery: memorial.gallery || {
        //  photos: [],
        //  audios: [],
        //  videos: [],
        //},
        theme: memorial.theme || "Flores",
        gallery: galleryData,
      })
    } catch (error) {
      //console.error("Erro ao carregar memorial para edição:", error)
      res.status(500).send("Erro interno do servidorrrrr")
    }
  },

  // Atualizar memorial
  updateMemorial: async (req, res) => {
    try {
      const { slug } = req.params
      //const { gender, relationship, birth, death } = req.body // Aqui você pode pegar os dados do formulário
      const updateData = req.body

      await Memorial.findOneAndUpdate({ slug: slug }, updateData, { new: true })

      /*
      // Lógica para encontrar e atualizar o memorial no banco
      const memorial = await Memorial.findOneAndUpdate(
        { slug: slug },
        { gender, relationship, birth, death },
        { new: true } // Retorna o memorial atualizado
      )
      */

      // Redirecionar ou exibir o memorial atualizado
      res.redirect(`/memorial/${slug}`) // Ou qualquer outro redirecionamento que faça sentido
    } catch (err) {
      console.error(err)
      res.status(500).send("Erro ao atualizar memorial")
    }
  },

  // Método para exibir a página de pesquisa por memorial
  // Método para exibir a página de pesquisa por memorial
  searchMemorial: async (req, res) => {
    const termo = req.query.q // Obtém o termo digitado na pesquisa
    const loggedUser = req.session.loggedUser // Obtém o usuário logado
    //console.log("loggedUser", loggedUser)

    if (!termo) {
      return res.render("memorial/memorial-pesquisa", {
        resultados: [],
        termo,
        loggedUser,
      })
    }

    try {
      const resultados = await Memorial.find({
        $or: [
          { firstName: { $regex: termo, $options: "i" } }, // Busca pelo primeiro nome (case-insensitive)
          { lastName: { $regex: termo, $options: "i" } }, // Busca pelo sobrenome (case-insensitive)
        ],
      }).lean() // Garante que os resultados sejam objetos simples

      // Converte o _id do usuário logado para string
      if (loggedUser && loggedUser._id) {
        loggedUser._id = loggedUser._id.toString()
      }

      // Converte todos os userId dos memoriais para string
      resultados.forEach((memorial) => {
        if (memorial.userId) {
          memorial.userId = memorial.userId.toString()
        }
      })

      res.render("memorial/memorial-pesquisa", {
        resultados,
        termo,
        loggedUser, // Passa o usuário logado para o template
      })

      //console.log("loggedUser (confirmado para template):", loggedUser)
    } catch (error) {
      console.error("Erro na pesquisa:", error)
      res
        .status(500)
        .render("errors/500", { message: "Erro ao realizar a pesquisa." })
    }
  },
  // Método para deletar memorial
  deleteMemorial: async (req, res) => {
    try {
      const { slug } = req.params

      //console.log("Recebendo requisição para deletar memorial:", slug)

      // Buscar memorial
      const memorial = await Memorial.findOne({ slug })
      if (!memorial) {
        return res.status(404).send("Memorial não encontrado.")
      }

      // (Opcional) Apagar as fotos e pastas
      const folderPath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "memorials",
        slug
      )
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true })
        //console.log("Pasta do memorial apagada:", folderPath)
        //console.log("Pasta de fotos do memorial apagada.")
      }

      // Deletar o memorial do banco
      await Memorial.deleteOne({ slug })

      // Redirecionar para o dashboard
      res.redirect("/auth/dashboard")
    } catch (error) {
      console.error("Erro ao deletar memorial:", error)
      res.status(500).send("Erro ao deletar memorial.")
    }
  },
}

module.exports = MemorialController
