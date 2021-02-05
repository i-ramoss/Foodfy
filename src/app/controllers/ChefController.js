const { unlinkSync } = require("fs")

const Chef = require("../models/Chef")
const Recipe = require("../models/Recipe")
const File = require("../models/File")

const LoadChefService = require("../services/LoadChefService")
const LoadRecipeService = require("../services/LoadRecipeService")

const { date } = require("../lib/utils")

module.exports = {
  async index(request, response) {
    try {
      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      const chefs = await LoadChefService.load("chefs")
      
      return response.render("admin/chefs/index", { chefs, success, error })
    }
    catch (err) {
      console.error(err)
    }
  },

  create(request, response) {
    return response.render("admin/chefs/create")
  }, 

  async post(request, response) {
    try {
      const { files } = request

      const file_id = await File.create({ name: files[0].filename, path: files[0].path })
    
      await Chef.create({
        name: request.body.name,
        file_id,
        created_at: date(Date.now()).iso
      })

      request.session.success = "Chef successfully created!"
      
      return response.status(201).redirect(`/admin/chefs`)
    } 
    catch (err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect(`/admin/chefs`)
    }
  },

  async show(request, response) {
    try {
      const { id }  = request.params

      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      const chef = await LoadChefService.load("chef", { where: { id } })
      const recipes = await LoadRecipeService.load("recipes", { where: { chef_id: id } })

      return response.render("admin/chefs/show", { chef, recipes, success, error })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async edit(request, response) {
    try {
      const { id } = request.params

      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      const chef = await LoadChefService.load("chef", { where: { id } })

      return response.render("admin/chefs/edit", { chef, success, error }) 
    } 
    catch (err) {
      console.error(err)
    }
  },

  async update(request, response) {
    try {
      const { id: chef_id, name, removed_files } = request.body
      const { files }  = request

      if (request.files.length !== 0) {
        const file_id = await File.create({ name:  files[0].filename, path: files[0].path })

        await Chef.update(chef_id, { name, file_id })
      }

      await Chef.update(chef_id, { name })

      if (removed_files) {
        if (request.files.length === 0 ) {
          request.session.error = "Please, sendo at least one image!"
          return response.redirect(`/admin/chefs/${chef_id}/edit`)
        }

        const removedFiles = removed_files.split(",")
        const file_id = removedFiles[0]

        const file = await File.findOne({ where: { id: file_id }})

        unlinkSync(file.path)

        await File.delete('id', file_id)
      }

      request.session.success = "Chef updated successfully!"

      return response.status(200).redirect(`/admin/chefs/${chef_id}`)  
    } 
    catch (err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect(`/admin/chefs/${request.body.id}`) 
    }
  },

  async delete(request, response) {
    try {
      const { id: chef_id } = request.body

      const recipesOfChef = await Recipe.findAll({ where: { chef_id } })
      const recipeFilesPromise = recipesOfChef.map( recipe => Recipe.files(recipe.id))
      const recipeFiles = await Promise.all(recipeFilesPromise)

      const chefFile = await Chef.files(chef_id)

      await Chef.delete("id", chef_id)

      unlinkSync(chefFile[0].path)

      await File.delete("id", chefFile[0].file_id)

      const removeRecipesFilesPromise = recipeFiles.map( files => {
        files.map( file => {
          unlinkSync(file.path)

          File.delete("id", file.file_id)
        })
      })

      await Promise.all(removeRecipesFilesPromise)

      request.session.success = "Chef deleted successfully!"

      return response.redirect("/admin/chefs")
    }
    catch (err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect("/admin/chefs/")
    }
  }
}