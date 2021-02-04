const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

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
    try {
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
      let recipes = results.rows

      if (recipes == "") {
        const pagination = { page }

        return response.render("site/recipes", { recipes, pagination })
      }

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page
      }

      async function getImage(recipeId) {
        let files = await Recipe.files(recipeId)

        files = files.map( file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)

        return files[0]
      }

      const recipesPromise = recipes.map( async recipe => {
        recipe.image = await getImage(recipe.id)

        return recipe
      })

      recipes = await Promise.all(recipesPromise)
    
      return response.render("site/recipes", { recipes, pagination })
    } 
    catch (err) {
      console.error(err)
    }
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
      let chefs = await Chef.findAll()

      async function getImage(chefId) {
        let files =  await Chef.files(chefId)
        
        files = files.map( file => `${request.protocol}://${request.headers.host}${file.path.replace('public', '')}`)

        return files[0]
      }

      const chefsPromise = chefs.map( async chef => {
        const totalChefRecipe = await Recipe.findAll({ where: { chef_id: chef.id } })

        chef.avatar = await getImage(chef.id)
        chef.total_recipes = totalChefRecipe.length

        return chef
      })

      chefs = await Promise.all(chefsPromise)

      return response.render("site/chefs", { chefs })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async results(request, response) {
    try {
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
      let recipes = results.rows

      if (recipes == "") {
        const pagination = { page }

        return response.render("site/results", { recipes, pagination })
      }

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page
      }

      async function getImage(recipeId) {
        let files = await Recipe.files(recipeId)

        files = files.map( file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)

        return files[0]
      }

      const recipesPromise = recipes.map( async recipe => {
        recipe.image = await getImage(recipe.id)

        return recipe
      })

      recipes = await Promise.all(recipesPromise)

      return response.render("site/results", { recipes, pagination, filter})
    } 
    catch (err) {
      console.error(err)
    }
  }
}