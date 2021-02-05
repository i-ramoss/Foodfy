const Chef = require("../models/Chef")
const Recipe = require("../models/Recipe")

async function getImages(chefId) {
  let files = await Chef.files(chefId)

  files = files.map( file => ({
    id: file.file_id,
    name: file.name,
    src: `${file.path.replace("public", "")}`
  })) 

  return files
}

async function format(chef) {
  let recipes = await Recipe.findAll({ where: { chef_id: chef.id } })

  const files = await getImages(chef.id)

  chef.avatar = files[0].src
  chef.files = files
  chef.total_recipes = recipes.length

  return chef
}

const LoadService = {
  load(service, filter) {
    this.filter = filter

    return this[service]()
  },

  async chef() {
    try {
      const chef = await Chef.findOne(this.filter)
      return format(chef)
    } 
    catch (err) {
      console.error(err)  
    }
  },

  async chefs() {
    try {
      const chefs = await Chef.findAll(this.filter)

      const chefsPromise = chefs.map(format)

      return Promise.all(chefsPromise)
    } 
    catch (err) {
      console.error(err)  
    }
  },

  format
}

module.exports = LoadService