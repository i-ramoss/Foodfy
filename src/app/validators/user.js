const User = require("../models/User")

function checkAllFields(body) {
  const keys = Object.keys(body)

  for (key of keys) {
    if (body[key] == "") {
      return {
        user: body,
        error: "Please, fill all fields!"
      }
    }
  }
}

async function create(request, response, next) {
  const fillAllFields = checkAllFields(request.body)
  const { email } = request.body

  if (fillAllFields) return response.render("admin/users/register", fillAllFields)

  const user = await User.findOne({ where: { email } })
  
  if (user) return response.render("admin/users/register", {
    user: request.body,
    error: "User already registered!"
  })
  
  next()
}

async function edit(request, response, next) {
  const { id } = request.params

  const user = await User.findOne({ where: {id} })

  if (!user) return response.status(404).render("admin/users/edit", {
    error: "User not found!"
  }) // change for login

  request.user = user

  next()
}

async function update(request, response, next) {
  const fillAllFields = checkAllFields(request.body)
  const { id } = request.body

  if (fillAllFields) return response.render("admin/users/edit", fillAllFields)

  const user = await User.findOne({ where: {id} })

  request.user = user

  next()
}

module.exports = {
  create,
  edit,
  update
}