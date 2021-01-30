const crypto = require("crypto")
const { hash } = require("bcryptjs")
const mailer = require("../lib/mailer")

const User = require("../models/User")

module.exports = {
  async list(request, response) {
    try {
      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      let users = await User.findAll()

      return response.render("admin/users/index", { users, success, error })
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
      const { name, email, is_admin } = request.body

      const firstPassword = crypto.randomBytes(20).toString("hex")

      const encryptedPassword = await hash(firstPassword, 8)
      
      await mailer.sendMail({
        to: email,
        from: "no-reply@foodfy.com.br",
        subject: `Welcome ${name}!`,
        html: `
          <h2>Welcome to Foodfy Company!</h2>
          <p>
            Don't worry! Click the link below to recover your password.
          </p>
          <p>
            You have just received your provisional password to access the Foodfy admin panel.
          </p>
          <p>
            This password can be changed in the future if you wish, by going to the password recovery session.
          </p>
          <h2>
            Your password: 
            ${firstPassword}
          </h2>
            <a href="http://localhost:3000/admin/login" target="_blank">
              Foodfy
            </a>
          </h2>
        `
      })

      await User.create({
        name,
        email,
        is_admin: is_admin || 0,
        password: encryptedPassword
      })

      request.session.success = "User successfully created!"

      return response.status(200).redirect("/admin/users")
    } 
    catch (err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect("/admin/users/register")
    }
  },

  async edit(request, response) {
    const { user, session: { success, error } } = request
    request.session.success = "", request.session.error = ""
    
    return response.render("admin/users/edit", { user, success, error })
  },

  async update(request, response) {
    try {
      let { name, email, is_admin } = request.body
      const { user } = request

      await User.update(user.id, {
        name,
        email,
        is_admin: is_admin || false
      }) 

      request.session.success = "Account updated successfully!"

      return response.status(200).redirect(`/admin/users/${user.id}/edit`)
    } 
    catch (err) {
      console.error(err)

      request.session.error = "Something went wrong!"

      return response.redirect(`/admin/users/${user.id}/edit`)
    }
  },

  async delete(request, response) {
    try {
      await User.delete(request.body.id)

      request.session.success = "User deleted successfully!"

      return response.status(204).redirect("/admin/users")
    } 
    catch (err) {
      console.error(err)  
    }
  }
}