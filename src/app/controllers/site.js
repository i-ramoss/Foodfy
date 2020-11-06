const Recipe = require("../models/Recipe")

module.exports = {
  index(request, response) {
    Recipe.all( recipes => {
      return response.render("site/index", { recipes })
    })
  },
  
  about(request, response) {
    return response.render("site/about")
  },

  all(request, response) {
    Recipe.all( recipes => {
      return response.render("site/recipes", { recipes })
    })
  },

  show(request, response) {
    Recipe.find(request.paramps.id, recipe => {
      if(!recipe) return response.status(404).render("site/not_found")

      return response.render("site/recipe", { recipe })
    })
  },

  results(request, response) {
    Recipe.all( recipes => {
      return response.render("site/results", { recipes })
    })
  }
}
