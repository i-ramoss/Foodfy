const { unlinkSync } = require("fs")

const Recipe = require("../models/Recipe")
const File = require("../models/File")
const Chef = require("../models/Chef")

const { date } = require("../lib/utils")

module.exports = {
  async index(request, response) {
    try {
      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      async function getImage(recipeId) {
        let files = await Recipe.files(recipeId)

        files = files.map( file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)

        return files[0]
      }

      async function getChef(recipeId) {
        let chef = await Chef.findOne({ where: { id: recipeId } })

        return chef.name
      }

      const recipesPromise = recipes.map( async recipe => {
        recipe.image = await getImage(recipe.id)
        recipe.chef_name = await getChef(recipe.chef_id)

        return recipe
      })

      recipes = await Promise.all(recipesPromise)

      return response.render("admin/recipes/index", { recipes, success, error })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async create(request, response) {
    try {
      const chefsOptions = await Chef.findAll()

      return response.render("admin/recipes/create", { chefsOptions })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async post(request, response) {
    try {
      const { title, chef, ingredients, preparation, information } = request.body

      const filesPromise = request.files.map( file => File.create({ name: file.filename, path: file.path }))

      const filesIds = await Promise.all(filesPromise)

      const recipe_id = await Recipe.create({ 
        title,
        chef_id: chef,
        user_id: request.session.userId,
        ingredients: `{${ingredients}}`,
        preparation: `{${preparation}}`,
        information,
        created_at: date(Date.now()).iso
      })

      File.init({ table: "recipe_files" })

      const recipeFilesPromise = filesIds.map( file_id => File.create({ recipe_id, file_id }))

      await Promise.all(recipeFilesPromise)

      request.session.success = "Recipe successfully created!"

      return response.status(201).redirect("/admin/recipes")
    } 
    catch (err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect("/admin/recipes/create")
    }
  },

  async show(request, response) {
    try { 
      let { recipe } = request

      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      let chef = await Chef.findOne({ where: { id: recipe.chef_id } })

      recipe.chef_name = chef.name

      let files = await Recipe.files(recipe.id)
      files = files.map( file => ({
        ...file,
        src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`
      }))

      return response.render("admin/recipes/show", { recipe, files, success, error })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async edit(request, response) {
    try {
      const { recipe } = request

      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      const chefsOptions = await Chef.findAll()

      let files = await Recipe.files(recipe.id)

      files = files.map( file => ({
        ...file,
        src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`
      }))
      
      return response.render("admin/recipes/edit", { recipe, chefsOptions, files, success, error })
    } 
    catch (err) {
      console.error(err)
    } 
  },

  async update(request, response) {
    try {
      let { id: recipe_id, title, chef, ingredients, preparation, information } = request.body

      await Recipe.update(recipe_id, {
        title,
        chef_id: chef,
        ingredients: `{${ingredients}}`,
        preparation: `{${preparation}}`,
        information
      })

      request.session.success = "Recipe successfully updated!"
  
      return response.status(200).redirect(`/admin/recipes/${recipe_id}`)
    } 
    catch (err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect(`/admin/recipes/${recipeId}/edit`)
    }
  },

  async delete(request, response) {
    try {
      const { id: recipe_id } = request.body

      const files = await Recipe.files(recipe_id)

      await Recipe.delete("id", recipe_id)

      files.map( async file => {
        try {
          unlinkSync(file.path)

          File.init({ table: "files" })
          
          await File.delete("id", file.file_id)
        }
        catch (err) {
          console.error(err)
        }
      })

      request.session.success = "Recipe deleted successfully!"

      return response.status(200).redirect("/admin/recipes/")
    } 
    catch(err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect(`/admin/recipes/${request.body.id}/edit`)
    }
  }
}
