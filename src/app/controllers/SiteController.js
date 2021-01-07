const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

module.exports = {
  async index(request, response) {
    try {
      let results = await Recipe.all()
      let recipes = results.rows

      async function getImage(recipeId) {
        let results = await Recipe.files(recipeId)

        const files = results.rows.map( file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)

        return files[0]
      }

      const recipesPromise = recipes.map( async recipe => {
        recipe.image = await getImage(recipe.id)

        return recipe
      }).filter((recipe, index) => index > 5 ? false : true)

      recipes = await Promise.all(recipesPromise)

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
        let results = await Recipe.files(recipeId)

        const files = results.rows.map( file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)

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
      let result = await Recipe.find(request.params.id)
      const recipe = result.rows[0]

      if(!recipe) return response.status(404).render("site/not-found")

      result = await Recipe.files(recipe.id)
      const files = result.rows.map( file => ({
        ...file,
        src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`
      }))
      
      return response.render("site/recipe", { recipe, files })
    } 
    catch (err) {
      console.error(err)
    }
  },

  async chefs(request, response) {
    try {
      const results = await Chef.all()
      let chefs = results.rows

      async function getImage(chefId) {
        let results = await Chef.files(chefId)
        const files = results.rows.map( file => `${request.protocol}://${request.headers.host}${file.path.replace('public', '')}`)

        return files[0]
      }

      const chefsPromise = chefs.map( async chef => {
        chef.avatar = await getImage(chef.id)

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
        let results = await Recipe.files(recipeId)

        const files = results.rows.map( file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)

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
