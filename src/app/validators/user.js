const User = require("../models/User")

async function create(request, response, next) {
  const keys = Object.keys(request.body)
  const { email } = request.body

  for (key of keys) {
    if (request.body[key] == "") {
      return response.render("admin/users/register", {
        user: request.body,
        error: "Please, fill all fields!"
      })
    } 
  }
  
  const user = await User.findOne({ where: { email } })
  
  if (user) return response.render("admin/users/register", {
    user: request.body,
    error: "User already registered!"
  })
  
  next()
}

module.exports = {
  create
}