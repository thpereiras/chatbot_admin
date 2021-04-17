const isAuthorized = function (req, res, next) {
  if (req.session.name && req.session.token) {
    return next()
  } else {
    let err = new Error("Error.")
    err.status = 500
    return next(err)
  }
}

module.exports = {
  isAuthorized
}
