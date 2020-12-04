const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

module.exports = {
  async index(request, response) {
    const { filter } = request.query

    if (filter) {
      let results =  await Recipe.findBy(filter)
      const recipes = results.rows

      return response.render("site/results", { recipes, filter })
    } else {
      let results = await Recipe.all()
      let recipes = results.rows

      return response.render("site/index", { recipes })
    }
  },
  
  about(request, response) {
    return response.render("site/about")
  },

  async all(request, response) {
    let { page, limit } = request.query

    page = page || 1
    limit = limit || 3
    let offset = limit * (page-1)

    const params = {
      page,
      limit,
      offset
    }

    let results = await Recipe.paginate(params)
    const recipes = results.rows

    if (recipes == "") return response.redirect("/recipes")

    const pagination = {
      total: Math.ceil(recipes[0].total / limit),
      page
    }
   
    return response.render("site/recipes", { recipes, pagination })
  },

  async show(request, response) {
    const result = await Recipe.find(request.params.id)
    const recipe = result.rows[0]

    if(!recipe) return response.status(404).render("site/not-found")
    
    return response.render("site/recipe", { recipe })
  },

  async chefs(request, response) {
    const results = await Chef.all()
    const chefs = results.rows

    return response.render("site/chefs", { chefs })
  },

  async results(request, response) {
    let { filter, page, limit } = request.query

    page = page || 1
    limit = limit || 2
    let offset = limit * (page-1)

    const params = {
      filter,
      page,
      limit,
      offset
    }

    let results = await Recipe.paginate(params)
    const recipes = results.rows

    if (recipes == "") return response.redirect("/results")

    const pagination = {
      total: Math.ceil(recipes[0].total / limit),
      page
    }

    return response.render("site/results", { recipes, pagination, filter})
  }
}
