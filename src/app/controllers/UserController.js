const crypto = require("crypto")
const { hash } = require("bcryptjs")
const mailer = require("../lib/mailer")

const User = require("../models/User")

module.exports = {
  async list(request, response) {
    try {
      const results = await User.all()
      let users = results.rows

      const { userId: id } = request.session
      const user = await User.findOne({ where: { id } })

      request.session.isAdmin = user.is_admin

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
      const user = await User.create(request.body)
      const { name, email, id } = user

      let firstPassword = crypto.randomBytes(20).toString("hex")

      const encryptedPassword = await hash(firstPassword, 8)

      await User.update( id, {
        password: encryptedPassword
      })
      
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

      const results = await User.all()
      let users = results.rows

      request.session.userId = id

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