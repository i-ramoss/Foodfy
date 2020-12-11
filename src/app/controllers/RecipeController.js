const Recipe = require("../models/Recipe")
const File = require("../models/File")

module.exports = {
  async index(request, response) {
    try {
      const results = await Recipe.all()
      const recipes = results.rows

      return response.render('admin/recipes/index', { recipes })
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
      const keys = Object.keys(request.body)

      for (key of keys) {
        if (request.body[key] == "")
          return response.json({ error: "Please, fill in all fields" })
      }

      if(request.files.length === 0) 
        return response.json("Please, send at least one image")
    
      let results = await Recipe.create(request.body)
      const recipeId = results.rows[0].id

      const filesPromise = request.files.map( file => File.createRecipeFile({
        ...file,
        recipe_id: recipeId
      }))

      await Promise.all(filesPromise)

      return response.status(201).redirect("/admin/recipes")
    } 
    catch (err) {
      console.error(err)
    }
  },

  async show(request, response) {
    try {
      let result = await Recipe.find(request.params.id)
      const recipe = result.rows[0]

      if(!recipe) return response.status(404).render("admin/recipes/not-found")

      result = await Recipe.files(recipe.id)
      const files = result.rows.map( file => ({
        ...file,
        src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`
      }))

      return response.render("admin/recipes/show", { recipe, files })
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
      const keys = Object.keys(request.body)

      for (key of keys) {
        if (request.body[key] == "" && key != "removed_files")
          return response.json({ err: "Please, fill all fields!" })
      }
    
      if (request.files.length != 0) {
        const newFilesPromise = request.files.map( file => 
          File.createRecipeFile({
            ...file, 
            recipe_id: request.body.id
          })
        )
  
        await Promise.all(newFilesPromise)
      }
  
      if (request.body.removed_files) {
        const removedFiles = request.body.removed_files.split(",")
        const lastIndex = removedFiles.length - 1
  
        removedFiles.splice(lastIndex, 1)
  
        const removedFilesPromise = removedFiles.map( id => File.delete(id))
  
        await Promise.all(removedFilesPromise)
      }
  
      await Recipe.update(request.body)
  
      return response.status(200).redirect(`/admin/recipes/${request.body.id}`)
    } 
    catch (err) {
      console.error(err)
    }
  },

  async delete(request, response) {
    try {
      await Recipe.delete(request.body.id)

      return response.status(200).redirect("/admin/recipes")
    } 
    catch(err) {
      console.error(err)
    }
  }
}
