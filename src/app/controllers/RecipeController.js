const Recipe = require("../models/Recipe")
const File = require("../models/File")

module.exports = {
  async index(request, response) {
    const results = await Recipe.all()
    const recipes = results.rows

    return response.render('admin/recipes/index', { recipes })
  },

  async create(request, response) {
    const results = await Recipe.chefSelectOptions()
    const chefsOptions = results.rows

    return response.render('admin/recipes/create', { chefsOptions })
  },

  async post(request, response) {
    if(request.files.lenght === 0) 
      return response.json("Please, send at least one image")

    let results = await Recipe.create(request.body)
    const recipeId = results.rows[0].id

    const filesPromise = request.files.map( file => File.createRecipeFile({
      ...file,
      recipe_id: recipeId
    }))

    await Promise.all(filesPromise)

    return response.status(201).redirect("/admin/recipes")
  },

  async show(request, response) {
    const result = await Recipe.find(request.params.id)
    const recipe = result.rows[0]

    if(!recipe) return response.status(404).render("admin/recipes/not-found")

    return response.render("admin/recipes/show", { recipe })
  },

  async edit(request, response) {
    let result = await Recipe.find(request.params.id)
    const recipe = result.rows[0]

    if(!recipe) return response.status(404).render("admin/recipes/not-found")

    // get chefs
    result = await Recipe.chefSelectOptions()
    const chefsOptions = result.rows

    // get images
    

    
    return response.render("admin/recipes/edit", { recipe, chefsOptions })
  },

  async update(request, response) {
    await Recipe.update(request.body)
     
    return response.status(200).redirect(`/admin/recipes/${request.body.id}`)
  },

  async delete(request, response) {
    await Recipe.delete(request.body.id)

    return response.status(200).redirect("/admin/recipes")
  }
}
