const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

async function getImages(recipeId) {
  let files = await Recipe.files(recipeId)

  files = files.map( file => ({
    id: file.file_id,
    name: file.name,
    src: `${file.path.replace("public", "")}`
  }))
    
  return files
}

async function format(recipe) {
  let chef = await Chef.findOne({ where: { id: recipe.chef_id } })

  const files = await getImages(recipe.id)

  recipe.image = files[0].src
  recipe.files = files
  recipe.chef_name = chef.name

  return recipe
}

const LoadService = {
  load(service, filter) {
    this.filter = filter

    return this[service]()
  },

  async recipe() {
    try {
      const recipe = await Recipe.findOne(this.filter)
      return format(recipe)
    } 
    catch (err) {
      console.error(err)  
    }
  },

  async recipes() {
    try {
      const recipes = await Recipe.findAll(this.filter)

      const recipesPromise = recipes.map(format)
      
      return Promise.all(recipesPromise)
    } 
    catch (err) {
      console.error(err)  
    }
  },

  format
}

module.exports = LoadService