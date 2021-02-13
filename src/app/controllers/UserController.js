const crypto = require("crypto")
const { hash } = require("bcryptjs")
const mailer = require("../lib/mailer")

const User = require("../models/User")

const { emailTemplate } = require("../lib/utils")

module.exports = {
  async list(request, response) {
    try {
      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      let { page, limit } = request.query

      page = page || 1
      limit = limit || 9

      let offset = limit * (page - 1)

      let users = await User.paginate({ page, limit, offset })

      if (users == "") {
        const pagination = { page }

        return response.render("admin/users/index", { users, pagination })
      }

      const pagination = {
        total: Math.ceil(users[0].total / limit),
        page
      }

      return response.render("admin/users/index", { users, pagination, success, error })
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

      const welcomeEmail = `
        <h2>Welcome to <strong>Foodfy</strong> Company! 🍕</h2>
        <h3 style = "font-size: 24px; font-weight: normal;">Hi <strong>${name}!!</strong></h3>
        <p>It will be a pleasure to work with you!</p>
        <h3>Here are your <strong>access data:</strong></h3>
        <p><strong>Login:</strong> ${email}</p>
        <p><strong>Password:</strong> ${firstPassword}<p>
        <br>
        <p>
          This is your temporary password and you can change it, if you want, on this
          <a href="http://localhost:3000/admin/forgot-password" target="_blank" style="text-decoration: none; color: black;">
            <strong>link</strong>
          </a>
        </p>
        <br>
        <h3>To access your account:</h3>
        <p>Just click the button below and you will be redirected to the Foodfy login page</p>
        <p style="text-align: center">
          <a style="display: block; margin: 32px auto; padding: 16px; width: 150px; color: black; background-color: #FBDFDB; text-decoration: none; border-radius: 4px;" target="_blank" href="http:localhost:5000/admin/login"
          >
          <strong>Welcome</strong>
          </a>
        </p>
        <br>
        <p style="padding-top: 16px; border-top: 2px solid #ccc">Sincelery, <strong>The Foodfy Team</strong> 🧁🥨</p>
      `
      
      await mailer.sendMail({
        to: email,
        from: "no-reply@foodfy.com.br",
        subject: `Welcome ${name}!`,
        html: emailTemplate(welcomeEmail)
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
      await User.delete("id", request.body.id)

      request.session.success = "User deleted successfully!"

      return response.status(204).redirect("/admin/users")
    } 
    catch (err) {
      console.error(err)  
    }
  }
}