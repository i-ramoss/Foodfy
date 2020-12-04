const Recipe = require("../models/Recipe")

module.exports = {
  index(request, response) {
    Recipe.all( recipes => {
      return response.render('admin/recipes/index', { recipes })
    })
  },

  create(request, response) {
    Recipe.chefSelectOptions( options => {
      return response.render('admin/recipes/create', { chefsOptions: options })
    })
  },

  post(request, response) {
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

      Recipe.chefSelectOptions( options => {
        return response.render("admin/recipes/edit", { recipe, chefsOptions: options })
      })
    })
  },

  update(request, response) {
    Recipe.update(request.body, () => {
      response.status(200).redirect(`/admin/recipes/${request.body.id}`)
    })
  },

  delete(request, response) {
    Recipe.delete(request.body.id, () => {
      response.status(200).redirect("/admin/recipes")
    })
  }
}
