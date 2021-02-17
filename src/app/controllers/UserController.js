const crypto = require("crypto")
const { hash } = require("bcryptjs")
const { unlinkSync } = require("fs")

const User = require("../models/User")
const File = require("../models/File")
const Recipe = require("../models/Recipe")

const mailer = require("../lib/mailer")
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

      return response.status(201).render("admin/animationsMessages/users/success")
    } 
    catch (err) {
      console.error(err)
      return response.render("admin/animationsMessages/error")
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

      return response.status(200).render("admin/animationsMessages/users/update", { name })
    } 
    catch (err) {
      console.error(err)
      return response.render("admin/animationsMessages/error")
    }
  },

  async delete(request, response) {
    try {
      const { id: user_id } = request.body

      const recipesOfUser = await Recipe.findAll({ where: { user_id } })
      const recipesFilesPromise = recipesOfUser.map( recipe => Recipe.files(recipe.id))
      const recipesFiles = await Promise.all(recipesFilesPromise)

      await User.delete("id", user_id)

      const removeRecipesFilesPromise = recipesFiles.map( files => {
        files.map( file => {
          unlinkSync(file.path)

          File.init({ table: "files" })

          File.delete("id", file.file_id)
        })
      })

      await Promise.all(removeRecipesFilesPromise)
      
      return response.status(201).redirect("/admin/users")
    } 
    catch (err) {
      console.error(err) 
      return response.render("admin/animationsMessages/error")
    }
  }
}