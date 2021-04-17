class ExpiredTokenError extends Error {
  constructor(error) {
    super(error.message)
    this.data = { error }
    this.statusCode = 401
  }
}

class ChatbotApiInternalError extends Error {
  constructor() {
    super("Chatbot Api Internal Error")
    this.statusCode = 500
  }
}

module.exports = {
  ExpiredTokenError,
  ChatbotApiInternalError
}
