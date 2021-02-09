const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

const LoadChefService = require("../services/LoadChefService")
const LoadRecipeService = require("../services/LoadRecipeService")

module.exports = {
  async index(request, response) {
    try {
      const allRecipes = await LoadRecipeService.load("recipes")
      const recipes = allRecipes.filter((recipe, index) => index > 5 ? false : true)

      return response.render("site/index", { recipes })
    } 
    catch (err) {
      console.error(err)
    }
  },
  
  about(request, response) {
    return response.render("site/about")
  },

  async all(request, response) {
    let { page, limit } = request.query

    page = page || 1
    limit = limit || 9

    let offset = limit * (page -1)

    let recipes = await Recipe.paginate({ page, limit, offset })
    const recipesPromise = recipes.map(LoadRecipeService.format)

    recipes = await Promise.all(recipesPromise)

    if (recipes == "") {
      const pagination = { page }

      return response.render("site/recipes", { recipes, pagination })
    }

    const pagination = {
      total: Math.ceil(recipes[0].total / limit),
      page
    }

    return response.render("site/recipes", { recipes, pagination })
  },

  async show(request, response) {
    try {
      const recipe = await LoadRecipeService.load("recipe", { where: { id: request.params.id } })

      if(!recipe) return response.status(404).render("admin/recipes/not-found")
      
      return response.render("site/recipe", { recipe })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async chefs(request, response) {
    try {
      const chefs = await LoadChefService.load("chefs")

      return response.render("site/chefs", { chefs })
    } 
    catch (err) {
      console.error(err)
    }
  }
}