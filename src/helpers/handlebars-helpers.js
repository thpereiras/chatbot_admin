const Handlebars = require("hbs")

Handlebars.registerHelper("times", function (n, block) {
  var accum = ""
  for (var i = 0; i < n; ++i) accum += block.fn(i)
  return accum
})

Handlebars.registerHelper("stars", function (a, b, block) {
  var accum = ""
  for (let i = 0; i < a; ++i) accum += block.fn(1)
  for (let i = a; i < b; ++i) accum += block.fn(0)
  return accum
})

Handlebars.registerHelper("timestamp", function (n) {
  const data = new Date(n)
  const f_date =
    ("0" + data.getDate()).substr(-2) +
    "/" +
    ("0" + (data.getMonth() + 1)).substr(-2) +
    "/" +
    data.getFullYear() +
    " " +
    ("0" + data.getHours()).substr(-2) +
    ":" +
    ("0" + data.getMinutes()).substr(-2)
  return f_date
})

Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this)
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this)
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this)
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this)
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this)
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this)
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this)
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this)
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this)
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this)
    default:
      return options.inverse(this)
  }
})
