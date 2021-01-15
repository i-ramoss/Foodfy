const User = require("../models/User")

module.exports = {
  index(request, response) {
    const { user } = request

    return response.render("admin/users/profile", { user })
  },

  async update(request, response) {
    try {
     let { name, email } = request.body
     const { user } = request
     
     await User.update(user.id, {
       name,
       email
     })

     return response.render("admin/users/profile", {
       user: request.body,
       success: "Account updated successfully!"
     })
    } 
    catch (err) {
      console.error(err)

      return response.render("admin/users/profile", {
        error: "Something went wrong. Try Again!"
      })
    }
  }
}