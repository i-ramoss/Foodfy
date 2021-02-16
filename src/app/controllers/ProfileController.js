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

     return response.status(200).render("admin/animationsMessages/users/update", { name })
    } 
    catch (err) {
      console.error(err)
      return response.render("admin/animationsMessages/error")
    }
  }
}