const Recipe = require("../models/Recipe")
const File = require("../models/File")

const { date } = require("../lib/utils")

module.exports = {
  async index(request, response) {
    try {
      let { success, error } = request.session
      request.session.success = "", request.session.error = ""

      async function getImage(recipeId) {
        let results = await Recipe.files(recipeId)

        const files = results.rows.map( file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)

        return files[0]
      }

      const recipesPromise = recipes.map( async recipe => {
        recipe.image = await getImage(recipe.id)

        return recipe
      })

      recipes = await Promise.all(recipesPromise)

      return response.render('admin/recipes/index', { recipes, success, error })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async create(request, response) {
    try {
      const results = await Recipe.chefSelectOptions()
      const chefsOptions = results.rows

      return response.render('admin/recipes/create', { chefsOptions })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async post(request, response) {
    try {
      const { title, chef_id, ingredients, preparation, information } = request.body

      const recipe_id = await Recipe.create({ 
        title,
        chef_id,
        user_id = request.session.userId,
        ingredients: `{${ingredients}}`,
        preparation: `{${preparation}}`,
        information,
        created_at: date(Date.now()).iso
      })

      const filesPromise = request.files.map( file => File.createRecipeFile({ name: file.filename, path: file.path, recipe_id }))

      await Promise.all(filesPromise)

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

      let result = await Recipe.find(request.params.id)
      const recipe = result.rows[0]

      if(!recipe) return response.status(404).render("admin/recipes/not-found")

      result = await Recipe.files(recipe.id)
      const files = result.rows.map( file => ({
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
      let results = await Recipe.find(request.params.id)
      const recipe = results.rows[0]

      if(!recipe) return response.status(404).render("admin/recipes/not-found")

      // get chefs
      results = await Recipe.chefSelectOptions()
      const chefsOptions = results.rows

      // get images
      results = await Recipe.files(recipe.id)
      let files = results.rows

      files = files.map( file => ({
        ...file,
        src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`
      }))
      
      return response.render("admin/recipes/edit", { recipe, chefsOptions, files })
    } 
    catch (err) {
      console.error(err)
    } 
  },

  async update(request, response) {
    try {
      let { title, chef, ingredients, preparation, information } = request.body

      const results = await Recipe.find(request.body.id)
      const recipeId = results.rows[0].id

      await Recipe.update(recipeId, {
        title,
        chef_id: chef,
        ingredients: `{${ingredients}}`,
        preparation: `{${preparation}}`,
        information
      })

      request.session.success = "Recipe successfully updated!"
  
      return response.status(200).redirect(`/admin/recipes/${request.body.id}`)
    } 
    catch (err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect(`/admin/recipes/${recipeId}/edit`)
    }
  },

  async delete(request, response) {
    try {
      await Recipe.delete(request.body.id)

      request.session.success = "Recipe deleted successfully!"

      return response.status(200).redirect("/admin/recipes")
    } 
    catch(err) {
      console.error(err)
      request.session.error = "Something went wrong!"
      return response.redirect(`/admin/recipes/${id}`)
    }
  }
}
