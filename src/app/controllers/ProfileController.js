const User = require("../models/User")

module.exports = {
  index(request, response) {
    const { user, session: { success, error } } = request
    request.session.success = "", request.session.error = ""

    user.firstName = user.name.split(" ")[0]

    return response.render("admin/users/profile", { user, success, error })
  },

  async update(request, response) {
    try {
     let { name, email } = request.body
     const { user } = request
     
     await User.update(user.id, {
       name,
       email
     })

     request.session.success = "User updated successfully!"

     return response.status(200).redirect(`/admin/profile`)
    } 
    catch (err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect(`/admin/profile`) 
    }
  }
}