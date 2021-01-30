const Chef = require("../models/Chef")
const Recipe = require("../models/Recipe")
const File = require("../models/File")

async function permission(request, response, next) {
  const { id } = request.params
  const { userId, isAdmin } = request.session
  
  const recipe = await Recipe.findOne({ where: { id }})

  if (recipe.user_id != userId && !isAdmin) return response.redirect("/admin/recipes")

  next()
}

async function index(request, response, next) {
  const { userId: id, isAdmin } = request.session

  isAdmin ? recipes = await Recipe.findAll() : recipes = await Recipe.userRecipes(id)

  next()
}

async function create(request, response, next) {
  const keys = Object.keys(request.body)

  let results = await Recipe.chefSelectOptions()
  const chefsOptions = results.rows

  for (key of keys) {
    if (request.body[key] === "")
      return response.render("admin/recipes/create", {
        recipe: request.body,
        chefsOptions,
        error: "Please, fill all fields!"
      })
  }

  if(request.files.length === 0) {
    return response.render("admin/recipes/create", {
      recipe: request.body,
      chefsOptions,
      error: "Please, send at least one image!"
    })
  }

  next() 
}

async function show(request, response, next) {
  const recipe = await Recipe.findOne({ where: { id: request.params.id }})

  if(!recipe) return response.status(404).render("admin/recipes/not-found")

  request.recipe = recipe

  next()
}

async function update(request, response, next) {
  const keys = Object.keys(request.body)

  const chefsOptions = await Chef.findAll()

  for (key of keys) {
    if (request.body[key] === "" && key !== "removed_files")
      return response.render("admin/recipes/edit", {
        recipe: request.body,
        chefsOptions,
        error: "Please, fill all fields!  "
      })
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
    if(request.files.length === 0) {
      return response.render("admin/recipes/edit", {
        recipe: request.body,
        chefsOptions,
        error: "Please, send at least one image!"
      })
    }
  
    const removedFiles = request.body.removed_files.split(",")
    const lastIndex = removedFiles.length - 1

    removedFiles.splice(lastIndex, 1)

    const removedFilesPromise = removedFiles.map( id => File.delete(id))

    await Promise.all(removedFilesPromise)
  }

  next()
}

module.exports = {
  permission,
  index,
  create,
  show,
  update
}