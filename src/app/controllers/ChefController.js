const Chef = require("../models/Chef")
const Recipe = require("../models/Recipe")
const File = require("../models/File")

module.exports = {
  async index(request, response) {
    try {
      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      const results = await Chef.all()
      let chefs = results.rows

      async function getImage(chefId) {
        let results = await Chef.files(chefId)

        const files = results.rows.map( file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)

        return files[0]
      }

      const chefsPromise = chefs.map( async chef => {
        chef.avatar = await getImage(chef.id)

        return chef
      })

      chefs = await Promise.all(chefsPromise)
  
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
      const filePromise = request.files.map( file => File.createChefFile({...file}))

      let results = await filePromise[0]
      const fileId = results.rows[0].id

      results = await Chef.create(request.body, fileId)

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
      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      const id  = request.params.id

      let result = await Chef.find(id)
      const chef = result.rows[0]

      result = await Chef.findRecipesByChef(id)
      const recipes = result.rows

      result = await Chef.files(chef.id)
      const files = result.rows.map( file => ({
        ...file,
        src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`
      }))

      async function getImage(recipeId) {
        let results = await Recipe.files(recipeId)

        const files = results.rows.map( file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)

        return files[0]
      }

      const recipesPromise = recipes.map( async recipe => {
        recipe.image = await getImage(recipe.id)

        return recipe
      })

      const lastAdded = await Promise.all(recipesPromise)

      return response.render("admin/chefs/show", { chef, recipes:lastAdded, files, success, error })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async edit(request, response) {
    try {
      let results = await Chef.find(request.params.id)
      const chef = results.rows[0]

      results = await Chef.files(chef.id)
      let files = results.rows
  
      files = files.map( file => ({
        ...file,
        src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`
      }))
  
      return response.render("admin/chefs/edit", { chef, files }) 
    } 
    catch (err) {
      console.error(err)
    }
  },

  async update(request, response) {
    try {
      let { chef_id: id } = request

      await Chef.update(request.body, id)

      if (request.body.removed_files) {
        if (request.files.length === 0 ) {
          return response.render("admin/chefs/edit", {
            chef: request.body,
            error: "Please, sendo at least one image!"
          })
        }

        const removedFiles = request.body.removed_files.split(",")
        const lastIndex = removedFiles.length - 1
  
        removedFiles.splice(lastIndex, 1)
  
        const removedFilesPromise = removedFiles.map( id => File.delete(id))
  
        await Promise.all(removedFilesPromise)
      }

      request.session.success = "Chef updated successfully!"

      return response.status(200).redirect(`/admin/chefs/${id}`)  
    } 
    catch (err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect(`/admin/chefs/${id}`) 
    }
  },

  async delete(request, response) {
    try {
      const id = request.body.id

      let result = await Chef.find(id)

      result = await Chef.findRecipesByChef(id)
      const recipes = result.rows

      if (recipes.length == 0) {
        result = await Chef.delete(id)

        request.session.success = "Chef deleted successfully!"

        response.status(200).redirect("/admin/chefs")
      }
      else {
        request.session.error = "You can't delete this Chef because there is a recipe registered on him"

        return response.status(401).redirect(`/admin/chefs/${id}/edit`)
      }
    }
    catch (err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect(`/admin/chefs/${id}/edit`)
    }
  }
}