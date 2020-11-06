const Recipe = require("../models/Recipe")

module.exports = {
  index(request, response) {
    Recipe.all( recipes => {
      return response.render('admin/recipes/index', { recipes })
    })
  },

  create(request, response) {
    return response.render('admin/recipes/create')
  },

  post(request, response) {
    const keys = Object.keys(request.body)

    for (key of keys) {
      if (request.body[key] == "")
        return response.json({ error: "Please, fill in all fields" })
    }

    Recipe.create(request.body, recipe => {
      return response.status(201).redirect("/admin/recipes")
    })

  },

  show(request, response) {
    Recipe.find(request.params.id, recipe => {
      if(!recipe) return response.status(404).render("admin/recipes/not-found")

      return response.render("admin/recipes/show", { recipe })
    })
  },

  edit(request, response) {
    Recipe.find(request.params.id, recipe => {
      if(!recipe) return response.status(404).render("admin/recipes/not-found")

      return response.render("admin/recipes/edit", { recipe })
    })
  },

  update(request, response) {
    const keys = Object.keys(request.body)
    
    for (key of keys) {
      if (request.body[key] == "")
      return response.json({error: "Please, fill in all fields"})
    }
   
    Recipe.update(request.body, () => {
      response.redirect(`/admin/recipes/${request.body.id}`)
    })
  },

  delete(request, response) {
    Recipe.delete(request.body.id, () => {
      response.redirect("/admin/recipes")
    })
  }
}
