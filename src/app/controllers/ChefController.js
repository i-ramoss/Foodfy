const Chef = require("../models/Chef")
const Recipe = require("../models/Recipe")
const File = require("../models/File")

module.exports = {
  async index(request, response) {
    try {
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
  
      return response.render("admin/chefs/index", { chefs })
    }
    catch (err) {
      console.error(err)
    }
  },

  create(request, response) {
    return response.render("admin/chefs/create")
  }, 

  async post(request, response) {
    const keys = Object.keys(request.body)

    for (key of keys) {
      if (request.body[key] == "")
        return response.json({ error: "Please, fill in all fields" })
    }

    if (request.files.length === 0) 
      return response.json("Please, send at least one image")

    try {
      const filePromise = request.files.map( file => File.createChefFile({...file}))

      let results = await filePromise[0]
      const fileId = results.rows[0].id

      results = await Chef.create(request.body, fileId)
  
      return response.status(201).redirect(`/admin/chefs`)
    } 
    catch (err) {
      console.error(err)
    }
  },

  async show(request, response) {
    try {
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

      return response.render("admin/chefs/show", { chef, recipes:lastAdded, files })
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
    const keys = Object.keys(request.body)

    for (key of keys) {
      if (request.body[key] == "" && key != "removed_files")
        return response.json({ err: "Please, fill all fields!" })
    }

    try {
      let results = await Chef.find(request.params.id)
      let id = results.rows[0]

      if (request.files.length != 0) {
        const newFilesPromise = request.files.map( file => File.createChefFile({ ...file }))
        
        results = await newFilesPromise[0]
        id = results.rows[0].id
      }

      await Chef.update(request.body, id)

      if (request.body.removed_files) {
        const removedFiles = request.body.removed_files.split(",")
        const lastIndex = removedFiles.length - 1
  
        removedFiles.splice(lastIndex, 1)
  
        const removedFilesPromise = removedFiles.map( id => File.delete(id))
  
        await Promise.all(removedFilesPromise)
      }

      return response.status(200).redirect(`/admin/chefs/${request.body.id}`)  
    } 
    catch (err) {
      console.error(err)
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

        response.status(200).redirect("/admin/chefs")
      }
      else
        response.status(401).json({ err: "You can't delete this user because there is a recipe registered on him"})
    }
    catch (err) {
      console.error(err)
    }
  }
}