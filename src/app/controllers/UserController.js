const User = require("../models/User")

module.exports = {
  registerForm(request, response) {
    return response.render("admin/users/register")
  },

  async create(request, response) {
    try {
      const userId = await User.create(request.body)


      return response.render("/admin/users/register", {
        user: request.body,
        success: "User registered with success!"
      })
    } 
    catch (err) {
      console.error(err)
    }
  }
}