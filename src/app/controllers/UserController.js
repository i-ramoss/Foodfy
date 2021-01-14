const User = require("../models/User")

module.exports = {
  list(request, response) {
    return response.render("admin/users/register")
  },

  registerForm(request, response) {
    return response.render("admin/users/register")
  },

  async create(request, response) {
    try {
      const userId = await User.create(request.body)

      request.session.userId = userId

      return response.status(200).render("admin/users/register", {
        user: request.body,
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
      
      return response.status(200).render("admin/users/register", {
        success: "Account updated successfully!"
      })
    } 
    catch (err) {
      console.error(err)
      return response.render("admin/users/register", {
        user: request.body,
        error: "Something went wrong!"
      })
    }
  }
}