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

  async adminRecipes(request, response) {},

  async adminChefs(request, response) {},

  async users(request, response) {}
}