const User = require("../models/User")

module.exports = {
  async list(request, response) {
    try {
      const results = await User.all()
      let users = results.rows

      return response.render("admin/users/index", { users })
    } 
    catch (err) {
      console.error(err)
    }
  },

  registerForm(request, response) {
    return response.render("admin/users/register")
  },

  async create(request, response) {
    try {
      const userId = await User.create(request.body)

      const results = await User.all()
      let users = results.rows

      request.session.userId = userId

      return response.status(200).render("admin/users/index", {
        users,
        success: "User registered with success!"
      })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async edit(request, response) {
    const { user } = request

    return response.render("admin/users/edit", { user })
  },

  async update(request, response) {
    try {
      let { name, email } = request.body
      const { user } = request

      await User.update(user.id, {
        name,
        email,
        is_admin: request.body.is_admin || false
      }) 
      
      return response.status(200).render("admin/users/edit", {
        user: request.body,
        success: "Account updated successfully!"
      })
    } 
    catch (err) {
      console.error(err)
      return response.render("admin/users/edit", {
        user: request.body,
        error: "Something went wrong!"
      })
    }
  }
}