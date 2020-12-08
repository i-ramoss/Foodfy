const Chef = require("../models/Chef")
const File = require("../models/File")

module.exports = {
  async index(request, response) {
    const results = await Chef.all()
    const chefs = results.rows

    return response.render("admin/chefs/index", { chefs })
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
    const id  = request.params.id

    let result = await Chef.find(id)
    const chef = result.rows[0]

    result = await Chef.findRecipesByChef(id)
    const recipes = result.rows

    return response.render("admin/chefs/show", { chef, recipes })
  },

  async edit(request, response) {
    let results = await Chef.find(request.params.id)
    const chef = results.rows[0]

    console.log(chef)
    
    results = await Chef.files(chef.file_id)
    let files = results.rows

    files = files.map( file => ({
      ...file,
      src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`
    }))

    console.log(files)

    return response.render("admin/chefs/edit", { chef, files })
  },

  async update(request, response) {
    const keys = Object.keys(request.body)

    for (key of keys) {
      if (request.body[key] == "")
        return response.json({ error: "Please, fill in all fields" })
    }

    await Chef.update(request.body)

    response.status(200).redirect(`/admin/chefs/${request.body.id}`)
  },

  async delete(request, response) {
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
}