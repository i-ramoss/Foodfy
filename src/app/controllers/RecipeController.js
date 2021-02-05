const { unlinkSync } = require("fs")

const Recipe = require("../models/Recipe")
const File = require("../models/File")
const Chef = require("../models/Chef")

const LoadRecipeService = require("../services/LoadRecipeService")

const { date } = require("../lib/utils")

module.exports = {
  async index(request, response) {
    try {
      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      const recipes = await LoadRecipeService.load("recipes")

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
      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      const recipe = await LoadRecipeService.load("recipe", { where: { id: request.params.id } })

      return response.render("admin/recipes/show", { recipe, success, error })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async edit(request, response) {
    try {
      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      const recipe = await LoadRecipeService.load("recipe", { where: { id: request.params.id } })

      const chefsOptions = await Chef.findAll()

      return response.render("admin/recipes/edit", { recipe, chefsOptions, success, error })
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
      return response.redirect(`/admin/recipes/${request.body.id}/edit`)
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
