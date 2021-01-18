const Recipe = require("../models/Recipe")

function checkAllFields(body) {
  const keys = Object.keys(body)

  for (key of keys) {
    if (body[key] == "") {
      return {
        recipe: body,
        error: "Please, fill all fields!"
      }
    }
  }
}

async function create(request, response, next) {
  const keys = Object.keys(request.body)

  let results = await Recipe.chefSelectOptions()
  const chefsOptions = results.rows

  for (key of keys) {
    if (request.body[key] === "" && key !== "removed_files")
      return response.render("admin/recipes/create", {
        recipe: request.body,
        chefsOptions,
        error: "Please, fill all fields!  "
      })
  }

  next() 
}

module.exports = {
  create
}