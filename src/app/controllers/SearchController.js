const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")
const User = require("../models/User")

const LoadRecipeService = require("../services/LoadRecipeService")
const LoadChefService = require("../services/LoadChefService")

module.exports = {
  async siteRecipes(request, response) {
    let { filter, page, limit } = request.query

    if (!filter || filter.toLowerCase() == "all recipes") filter = null

    page = page || 1
    limit = limit || 6

    let offset = limit * (page - 1)

    let recipes = await Recipe.search({ filter, limit, offset, userId: null, isAdmin: null })
    const recipesPromise = await recipes.map(LoadRecipeService.format)

    recipes = await Promise.all(recipesPromise)

    if (recipes == "") {
      const pagination = { page }
      const search = { term: filter }

      return response.render("site/results", { recipes, search, filter, pagination })
    }

    const pagination = {
      total: Math.ceil(recipes[0].total / limit),
      page
    }

    const search = {
      term: filter || "All Recipes"
    }

    return response.render("site/results", { recipes, search, filter, pagination })
  },

  async adminRecipes(request, response) {
    let { userId, isAdmin } = request.session
    let { filter, page, limit } = request.query

    if (!filter || filter.toLowerCase() == "all recipes") filter = null

    page = page || 1
    limit = limit || 6

    let offset = limit * (page - 1)

    let recipes = await Recipe.search({ filter, limit, offset, userId, isAdmin })
    const recipesPromise = await recipes.map(LoadRecipeService.format)

    recipes = await Promise.all(recipesPromise)

    if (recipes == "") {
      const pagination = { page }

      return response.render("admin/recipes/index", { recipes, search, filter, pagination })
    }

    const pagination = {
      total: Math.ceil(recipes[0].total / limit),
      page
    }

    const search = {
      term: filter || "All Recipes"
    }

    return response.render("admin/recipes/index", { recipes, search, filter, pagination })
  },

  async adminChefs(request, response) {
    let { filter, page, limit } = request.query

    if (!filter || filter.toLowerCase() == "all chefs") filter = null

    page = page || 1
    limit = limit || 2

    let offset = limit * (page - 1)

    let chefs = await Chef.search({ filter, limit, offset })
    const chefsPromise = await chefs.map(LoadChefService.format)

    chefs = await Promise.all(chefsPromise)

    if (chefs == "") {
      const pagination = { page } 

      return response.render("admin/chefs/index", { chefs, search, filter, pagination })
    }

    const pagination = {
      total: Math.ceil(chefs[0].total / limit),
      page
    }

    const search = {
      term: filter || "All Chefs"
    }

    return response.render("admin/chefs/index", { chefs, search, filter, pagination })
  },

  async users(request, response) {
    let { filter, page, limit } = request.query

    if (!filter || filter.toLowerCase() == "all users") filter = null

    page = page || 1
    limit = limit || 2

    let offset = limit * (page - 1)

    let users = await User.search({ filter, limit, offset })

    if (users == "") {
      const pagination = { page }

      return response.render("admin/users/index", { users, search, filter, pagination })
    }

    const pagination = {
      total: Math.ceil(users[0].total / limit),
      page
    }

    const search = {
      term: filter || "All Users"
    }

    return response.render("admin/users/index", { users, search, filter, pagination })
  }
}