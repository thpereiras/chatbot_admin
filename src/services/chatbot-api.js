const request = require("request")
const { ChatbotApiInternalError, ExpiredTokenError } = require("../error/error")

const url = process.env.CHATBOT_API_URL

const restart_chatbot = async (token) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: url + "/restart",
        headers: { Authorization: "Bearer " + token }
      },
      async (error, response) => {
        if (error) {
          reject(error)
        } else if (response.statusCode === 401) {
          reject(new ExpiredTokenError(response.body))
        } else if (response.statusCode === 500) {
          reject(new ChatbotApiInternalError())
        } else {
          resolve(JSON.parse(response.body))
        }
      }
    )
  })
}

const login = async (login, password) => {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: url + "/api/login",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password })
      },
      async (error, response) => {
        if (error) {
          reject(error)
        } else {
          if (response.toJSON().statusCode !== 200) {
            reject(response.toJSON().statusCode)
          } else {
            let body_response = JSON.parse(response.body)
            resolve({ token: body_response.token, name: body_response.name })
          }
        }
      }
    )
  })
}

const ping = async (token) => {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: url + "/api/ping",
        headers: { Authorization: "Bearer " + token }
      },
      async (error, response) => {
        if (error) {
          reject(error)
        } else if (response.statusCode === 401) {
          reject(new ExpiredTokenError(response.body))
        } else if (response.statusCode === 500) {
          reject(new ChatbotApiInternalError())
        } else {
          resolve()
        }
      }
    )
  })
}

const avaliacoesRespostas = async (page = 1, token) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: url + "/rating/response/" + page,
        headers: { Authorization: "Bearer " + token }
      },
      async (error, response) => {
        if (error) {
          reject(error)
        } else if (response.statusCode === 401) {
          reject(new ExpiredTokenError(response.body))
        } else if (response.statusCode === 500) {
          reject(new ChatbotApiInternalError(""))
        } else {
          resolve(JSON.parse(response.body))
        }
      }
    )
  })
}

const avaliacoesFinais = async (page = 1, token) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: url + "/rating/final/" + page,
        headers: { Authorization: "Bearer " + token }
      },
      async (error, response) => {
        if (error) {
          reject(error)
        } else if (response.statusCode === 401) {
          reject(new ExpiredTokenError(response.body))
        } else if (response.statusCode === 500) {
          reject(new ChatbotApiInternalError())
        } else {
          resolve(JSON.parse(response.body))
        }
      }
    )
  })
}

const treinamento = async (page = 1, token) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: url + "/training/" + page,
        headers: { Authorization: "Bearer " + token }
      },
      async (error, response) => {
        if (error) {
          reject(error)
        } else if (response.statusCode === 401) {
          reject(new ExpiredTokenError(response.body))
        } else if (response.statusCode === 500) {
          reject(new ChatbotApiInternalError())
        } else {
          resolve(JSON.parse(response.body))
        }
      }
    )
  })
}

const treinamento_adicionar = async (questions, answer) => {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: url + "/training/create",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answer })
      },
      async (error, response) => {
        if (error) {
          reject(error)
        } else if (response.statusCode === 401) {
          reject(new ExpiredTokenError(response.body))
        } else if (response.statusCode === 500) {
          reject(new ChatbotApiInternalError())
        } else {
          resolve({ success: true })
        }
      }
    )
  })
}

const treinamento_remover = async (id, token) => {
  return new Promise((resolve, reject) => {
    request.delete(
      {
        url: url + "/training/" + id,
        headers: { Authorization: "Bearer " + token }
      },
      async (error, response) => {
        if (error) {
          reject(error)
        } else if (response.statusCode === 401) {
          reject(new ExpiredTokenError(response.body))
        } else if (response.statusCode === 500) {
          reject(new ChatbotApiInternalError())
        } else {
          resolve(response.statusCode)
        }
      }
    )
  })
}

module.exports = {
  restart_chatbot,
  login,
  ping,
  avaliacoesRespostas,
  avaliacoesFinais,
  treinamento,
  treinamento_adicionar,
  treinamento_remover
}
