const express = require("express")
const router = express.Router()
const chatbotApi = require("../services/chatbot-api")
const authMiddleware = require("../middleware/auth")

router.get("/avaliacao/resposta/:page?", (req, res, next) => {
  const page = req.params.page ? req.params.page : 1
  chatbotApi
    .avaliacoesRespostas(page, req.session.token)
    .then((result) => {
      res.render("avaliacao-resposta", {
        title: "Chatbot Admin",
        data: result.data,
        username: req.session.name
      })
    })
    .catch((err) => {
      next(err)
    })
})

router.get(
  "/avaliacao/final/:page?",
  authMiddleware.isAuthorized,
  (req, res, next) => {
    const page = req.params.page ? req.params.page : 1
    chatbotApi
      .avaliacoesFinais(page, req.session.token)
      .then((result) => {
        res.render("avaliacao-final", {
          title: "Chatbot Admin",
          data: result.data,
          username: req.session.name
        })
      })
      .catch((err) => {
        next(err)
      })
  }
)

router.get("/treinamento", authMiddleware.isAuthorized, (req, res, next) => {
  const page = req.params.page ? req.params.page : 1
  chatbotApi
    .treinamento(page, req.session.token)
    .then((result) => {
      res.render("treinamento", {
        title: "Chatbot Admin",
        data: result.data,
        username: req.session.name
      })
    })
    .catch((err) => {
      next(err)
    })
})

router.get("/treinamento/form", authMiddleware.isAuthorized, (req, res) => {
  res.render("treinamento-form", {
    title: "Chatbot Admin"
  })
})

router.post("/treinamento/criar", authMiddleware.isAuthorized, (req, res) => {
  chatbotApi
    .treinamento_adicionar(req.body.questions, req.body.answer)
    .then((result) => {
      if (result.success) {
        res.render("treinamento-criar", {
          title: "Chatbot Admin",
          success: true,
          msg: "Pergunta e resposta criadas com sucesso."
        })
      } else {
        res.render("treinamento-criar", {
          title: "Chatbot Admin",
          success: false,
          msg: "Não foi possível criar a pergunta/resposta."
        })
      }
    })
    .catch(() => {
      res.render("treinamento-criar", {
        title: "Chatbot Admin",
        success: false,
        msg: "Não foi possível criar a pergunta/resposta."
      })
    })
})

router.get(
  "/treinamento/remover/:id",
  authMiddleware.isAuthorized,
  (req, res, next) => {
    chatbotApi
      .treinamento_remover(req.params.id, req.session.token)
      .then(() => {
        res.redirect("/treinamento")
      })
      .catch((err) => {
        next(err)
      })
  }
)

router.get("/treinar", authMiddleware.isAuthorized, (req, res) => {
  chatbotApi
    .restart_chatbot(req.session.token)
    .then(() => {
      res.render("treinamento-chatbot", {
        title: "Chatbot Admin",
        success: true,
        msg: "Chatbot API treinado com sucesso."
      })
    })
    .catch(() => {
      res.render("treinamento-chatbot", {
        title: "Chatbot Admin",
        success: false,
        msg: "Não foi possível reiniciar o Chatbot API."
      })
    })
})

module.exports = router
