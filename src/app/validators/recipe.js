const { unlinkSync } = require("fs")

const Chef = require("../models/Chef")
const Recipe = require("../models/Recipe")
const File = require("../models/File")

async function permission(request, response, next) {
  const { id } = request.params
  const { userId, isAdmin } = request.session
  
  const recipe = await Recipe.findOne({ where: { id } })

  if(!recipe) return response.status(404).render("admin/recipes/not-found")

  if (recipe.user_id != userId && !isAdmin) {
    request.session.error = "Sorry, you don't have permission to access this recipe."
    return response.redirect("/admin/recipes")
  } 

  next()
}

async function create(request, response, next) {
  const keys = Object.keys(request.body)

  const chefsOptions = await Chef.findAll()

  if(request.files.length === 0) {
    return response.render("admin/recipes/create", {
      recipe: request.body,
      chefsOptions,
      error: "Please, send at least one image!"
    })
  }

  for (key of keys) {
    if (request.body[key] === "")
      return response.render("admin/recipes/create", {
        recipe: request.body,
        chefsOptions,
        error: "Please, fill all fields!"
      })
  }

  next() 
}

async function update(request, response, next) {
  const { id: recipe_id, removed_files } = request.body
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

  if (request.files.length !== 0 ) {
    File.init({ table: "files" })

    const newFilesPromise = request.files.map( file => File.create({ name: file.filename, path: file.path }))
    const filesIds = await Promise.all(newFilesPromise)

    File.init({ table: "recipe_files" })

    const relationPromise = filesIds.map( file_id => File.create({ recipe_id, file_id }))
    await Promise.all(relationPromise)
  }

  if (removed_files) {
    let removedFiles = removed_files.split(",")
    const lastIndex = removedFiles.length - 1

    removedFiles.splice(lastIndex, 1)

    const removedFilesPromise = removedFiles.map( async id => {
      try {
        File.init({ table: "files" })

        const file = await File.findOne({ where: { id } })
        
        unlinkSync(file.path)

        File.init({ table: "recipe_files" })
        await File.delete('file_id', id)

        File.init({ table: "files" })
        await File.delete('id', id)
      } 
      catch (err) {
        console.error(err)  
      }
    })

    await Promise.all(removedFilesPromise)
  }

  next()
}

module.exports = {
  permission,
  create,
  update
}