const Chef = require("../models/Chef")

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

    const results = await Chef.create(request.body)
    const chef = results.rows[0]

    return response.status(201).redirect(`/admin/chefs`)
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
    const result = await Chef.find(request.params.id)
    const chef = result.rows[0]

    return response.render("admin/chefs/edit", { chef })
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