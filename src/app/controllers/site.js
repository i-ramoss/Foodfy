const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

module.exports = {
  index(request, response) {
    const { filter } = request.query

    if (filter) {
      Recipe.findBy((filter, recipes) => {
        return response.render("site/results", { recipes, filter })
      })
    } else {
      Recipe.all( recipes => {
        return response.render("site/index", { recipes })
      })
    }
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
    Recipe.find(request.params.id, recipe => {
      if(!recipe) return response.status(404).render("site/not-found")

      return response.render("site/recipe", { recipe })
    })
  },

  chefs(request, response) {
    Chef.all( chefs => {
      return response.render("site/chefs", { chefs })
    })
  },

  results(request, response) {
    const { filter } = request.query

    if (filter) {
      Recipe.findBy(filter, recipes => {
        return response.render("site/results", { recipes, filter })
      })
    } else {
      Recipe.all( recipes => {
        return response.render("site/results", { recipes })
      })
    }
  }
}
