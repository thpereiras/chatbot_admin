const path = require("path")
const express = require("express")
const hbs = require("hbs")
const exphbs = require("express-handlebars")
const app = express()
const cookieSession = require("cookie-session")
const { ChatbotApiInternalError, ExpiredTokenError } = require("./error/error")

const publicDirPath = path.join(__dirname, "./public")
const viewDirPath = path.join(__dirname, "./templates/views")
const partialsDirPath = path.join(__dirname, "./templates/partials")
const chatbotApi = require("./services/chatbot-api")

app.use(express.static(publicDirPath))

app.use(express.json()) // support json encoded bodies
app.use(express.urlencoded({ extended: true })) // support encoded bodies

app.use(
  cookieSession({
    name: "session",
    keys: [
      process.env.SESSION_COOKIE_KEY1,
      process.env.SESSION_COOKIE_KEY2,
      process.env.SESSION_COOKIE_KEY3
    ],
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
)

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/about.html"))
})

// Setup Handlebars engine and view location
app.set(
  "view engine",
  "hbs",
  exphbs({
    extname: ".hbs",
    helpers: require("./helpers/handlebars-helpers")
  })
)
app.set("views", viewDirPath)
app.set("isCached", process.env.NODE_ENV !== "production" ? false : true)
hbs.registerPartials(partialsDirPath)

const authenticationRouter = require("./routes/authentication.js")
const adminRouter = require("./routes/admin.js")
app.use("/", authenticationRouter)
app.use("/", adminRouter)

app.get("/", (req, res) => {
  if (req.session.token) {
    res.redirect("/home")
  }
  res.render("index", { title: "Chatbot Admin" })
})

app.get("/home", (req, res) => {
  if (!req.session.token) {
    res.redirect("/")
  } else {
    chatbotApi
      .ping(req.session.token)
      .then(() => {
        res.render("home", {
          title: "Chatbot Admin",
          username: req.session.name
        })
      })
      .catch(() => {
        res.redirect("/logout")
      })
  }
})

app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof ExpiredTokenError) {
      res.redirect("/logout?token_expired=true")
    } else if (err instanceof ChatbotApiInternalError) {
      res.render("error", {
        title: "Chatbot Admin",
        msg:
          "Desculpe, ocorreu um erro interno na API do Chatbot. Tente novamente mais tarde."
      })
    } else {
      res.render("error", {
        title: "Chatbot Admin",
        msg: "Desculpe, ocorreu um erro interno. Tente novamente mais tarde."
      })
    }
  } else {
    next()
  }
})

app.get("*", (req, res) => {
  res.render("error", {
    title: "Chatbot Admin",
    error: "404 página não encontrada"
  })
})

app.listen(process.env.PORT, () => {
  console.log("Server is up on port " + process.env.PORT + ".")
})
