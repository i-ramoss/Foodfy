const { compare } = require("bcryptjs")

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
  })

  request.user = user

  next()
}

async function update(request, response, next) {
  const fillAllFields = checkAllFields(request.body)
  const { id } = request.body

  if (fillAllFields) return response.render("admin/users/edit", fillAllFields)

  const user = await User.findOne({ where: { id } })

  request.user = user

  next()
}

async function profile(request, response, next) {
  const { userId: id } = request.session
  const user = await User.findOne({ where: { id } })

  if (!user) return response.render("admin/users/register", {
    error: "User not found!"
  })

  request.user = user

  next()
}

async function profileUpdate(request, response, next) {
  const fillAllFields = checkAllFields(request.body)
  const { password } = request.body
  const { userId: id } = request.session

  if (fillAllFields) return response.render("admin/users/profile", fillAllFields)

  if (!password) return response.render("admin/users/profile", {
    user: request.body,
    error: "Please, enter your password to confirm changes"
  })

  const user = await User.findOne({ where: { id } })
  const passed = await compare(password, user.password)

  if (!passed) return response.render("admin/users/profile", {
    user: request.body,
    err: "Incorrect Password"
  })

  request.user = user

  next()
}

async function adminDeletesOwnAccount(request, response, next) {
  const { userId } = request.session
  const { id } = request.body

  const user = await User.findOne({ where: { id } })

  if(userId == id) {
    return response.render("admin/users/profile", {
      user,
      error: "Sorry you can't delete your own account!"
    })
  }

  next()
}

module.exports = {
  create,
  edit,
  update,
  profile,
  profileUpdate,
  adminDeletesOwnAccount
}