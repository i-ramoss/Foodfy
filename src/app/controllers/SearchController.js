const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")
const User = require("../models/User")

const LoadRecipeService = require("../services/LoadRecipeService")
const LoadChefService = require("../services/LoadChefService")

module.exports = {
  async siteRecipes(request, response) {
    let { filter } = request.query

    if (!filter || filter.toLowerCase() == "all recipes") filter = null

    let recipes = await Recipe.search({ filter })

    const recipesPromise = await recipes.map(LoadRecipeService.format)

    recipes = await Promise.all(recipesPromise)

    const search = {
      term: filter || "All Recipes"
    }

    return response.render("site/results", { recipes, search })
  },

  async adminRecipes(request, response) {
    let { filter } = request.query

    if (!filter || filter.toLowerCase() == "all recipes") filter = null

    let recipes = await Recipe.search({ filter })

    const recipesPromise = await recipes.map(LoadRecipeService.format)

    recipes = await Promise.all(recipesPromise)

    const search = {
      term: filter || "All Recipes"
    }

    return response.render("admin/recipes/index", { recipes, search, filter })
  },

  async adminChefs(request, response) {
    let { filter } = request.query

    if (!filter || filter.toLowerCase() == "all chefs") filter = null

    let chefs = await Chef.search({ filter })

    const chefsPromise = await chefs.map(LoadChefService.format)

    chefs = await Promise.all(chefsPromise)

    const search = {
      term: filter || "All Chefs"
    }

    return response.render("admin/chefs/index", { chefs, search, filter })
  },

  async users(request, response) {
    let { filter } = request.query

    if (!filter || filter.toLowerCase() == "all users") filter = null

    let users = await User.search({ filter })

    const search = {
      term: filter || "All Users"
    }

    return response.render("admin/users/index", { users, search, filter })
  }
}