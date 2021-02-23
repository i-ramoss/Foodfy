const crypto = require("crypto")
const { hash } = require("bcryptjs")

const User = require("../models/User")

const mailer = require("../../lib/mailer")
const { emailTemplate } = require("../../lib/utils")

module.exports = {
  loginForm(request, response) {
    let { success, error } = request.session
    request.session.success = "", request.session.error = ""

    const { user } = request

    return response.render("admin/session/login", { user, success, error })
  },

  login(request, response) {
    request.session.userId = request.user.id
    request.session.isAdmin = request.user.is_admin

    request.session.success = "Login successfully!"

    return response.redirect("/admin/profile")
  },

  logout(request, response) {
    request.session.destroy()

    return response.redirect("/")
  },

  forgotForm(request, response) {
    let { success, error } = request.session
    request.session.success = "", request.session.error = ""

    return response.render("admin/session/forgot-password", { success, error })
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

      const resetPasswordEmail = `
        <h2 style="font-size: 24px;">Did you lose your password? 🔑</h2>
        <br>
        <h3>Looks like our amazing cheese recipes messed with your head, huh? 🤣🧀</h3>
        <p>
          Jokes aside, let's solve this! 
          <br><br>
          Click the button below to <strong>reset your password:<strong>
        </p>
        <p style="text-align: center;">
          <a
            style="display: block; margin: 32px auto; padding: 30px; width: 150px; color: black; background-color: #FBDFDB; text-decoration: none; border-radius: 4px;" target="_blank" href="http:localhost:5000/admin/reset-password?token=${token}"
          >
          <strong>Recover Password</strong>
          </a>
        </p>
        <p style ="padding-top: 20px; border-top: 2px solid #ccc">Sincelery, <strong>The Foodfy Team</strong> 🧁🥨</p>
      `
  
      await mailer.sendMail({
        to: user.email,
        from: "no-reply@foodfy-recipes.com.br",
        subject: "Password Recovery",
        html: emailTemplate(resetPasswordEmail)
      })

      request.session.success = "Check your email to reset your password!"

      return response.redirect("/admin/forgot-password")
    } 
    catch (err) {
      console.error(err) 
      request.session.error = "Unexpected error, try again!"
      return response.redirect("/admin/forgot-password") 
    }
  },

  resetForm(request, response) {
    let { success, error } = request.session
    request.session.success = "", request.session.error = ""

    const { token } = request.query

    return response.render("admin/session/reset-password", { token, success, error })
  },

  async reset(request, response) {
    try {
      let { user } = request
      let { password } = request.body

      const newPassword = await hash(password, 8)

      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: ""
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