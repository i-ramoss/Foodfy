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
    let { page, limit } = request.query

    page = page || 1
    limit = limit || 3
    let offset = limit * (page-1)

    const params = {
      page,
      limit,
      offset,
      callback(recipes) {
        if (recipes == "") return response.redirect("/recipes")

        const pagination = {
          total: Math.ceil(recipes[0].total / limit),
          page
        }

        return response.render("site/recipes", { recipes, pagination })
      }
    }

    Recipe.paginate(params)
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
    let { filter, page, limit } = request.query

    page = page || 1
    limit = limit || 2
    let offset = limit * (page-1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        if (recipes == "") return response.redirect("/results")

        const pagination = {
          total: Math.ceil(recipes[0].total / limit),
          page
        }

        return response.render("site/results", { recipes, pagination, filter })
      }
    }

    Recipe.paginate(params)
  }
}
