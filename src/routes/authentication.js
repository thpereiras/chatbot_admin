const express = require("express")
const router = express.Router()
const chatbotApi = require("../services/chatbot-api.js")

router.post("/login", (req, res) => {
  chatbotApi
    .login(req.body.login, req.body.password)
    .then((result) => {
      req.session.name = result.name
      req.session.login = result.login
      req.session.token = result.token

      res.redirect("/home")
    })
    .catch((error) => {
      let authentication_error
      switch (error) {
        case 401:
          authentication_error = "Usuário ou senha inválida."
          break
        default:
          authentication_error =
            "Ocorreu um erro no servidor. Tente novamente mais tarde."
          break
      }
      res.render("index", {
        title: "Chatbot Admin",
        error: authentication_error
      })
    })
})

router.get("/logout", (req, res) => {
  console.log(req.query.token_expired)
  req.session = null
  let token_expired = req.query.token_expired
  if (token_expired) {
    res.render("index", {
      title: "Chatbot Admin",
      error: "Sessão expirada."
    })
  } else {
    res.redirect("/")
  }
})

module.exports = router
