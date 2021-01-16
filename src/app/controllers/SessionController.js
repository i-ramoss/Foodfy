const crypto = require("crypto")
const mailer = require("../lib/mailer")
const { hash } = require("bcryptjs")

const User = require("../models/User")

module.exports = {
  loginForm(request, response) {
    return response.render("admin/session/login")
  },

  login(request, response) {
    request.session.userId = request.user.id
    request.session.isAdmin = request.user.is_admin

    return response.redirect("/admin/profile")
  },

  logout(request, response) {
    request.session.destroy()

    return response.redirect("/")
  },

  forgotForm(request, response) {
    return response.render("admin/session/forgot-password")
  },

  async forgot(request, response) {
    try {
      const { user } = request
      const token = crypto.randomBytes(20).toString("hex")
  
      let now = new Date()
      now = now.setHours(now.getHours() + 1)
  
      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })
  
      await mailer.sendMail({
        to: user.email,
        from: "no-reply@foodfy-recipes.com.br",
        subject: "Password Recovery",
        html: `
          <h2>Lost the access key?</h2>
          <p>Don't worry! Click the link below to recover your password.</p>
          <p>
            <a href="http://localhost:3000/admin/reset-password?token=${token}" target="_blank">
              RECOVER PASSWORD
            </a>
          </p>
        `
      })

      return response.render("admin/session/forgot-password", {
        success: "Check your email to reset your password!"
      })
    } 
    catch (err) {
      console.error(err) 

      return response.render("admin/session/forgot-password", {
        error: "Unexpected error, try again!"
      }) 
    }
  },

  resetForm(request, response) {
    return response.render("admin/session/reset-password", { 
      token: request.query.token
    })
  },

  async reset(request, response) {
    try {
      let { user } = request
      let { password, token } = request.body

      const newPassword = await hash(password, 8)

      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token: ""
      })

      return response.render("admin/session/login", {
        user: request.body,
        success: "Password updated successfully!"
      })
    } 
    catch (err) {
      console.error(err)

      return response.render("admin/session/reset-password", {
        user: request.body,
        token,
        error: "Unexpected error, try again!"
      }) 
    }
  }
}