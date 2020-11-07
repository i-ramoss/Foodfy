const Chef = require("../models/Chef")

module.exports = {
  index(request, response) {
    Chef.all( chefs => {
      return response.render("admin/chefs/index", { chefs })
    })
  },

  create(request, response) {
    return response.render("admin/chefs/create")
  }, 

  post(request, response) {
    const keys = Object.keys(request.body)

    for (key of keys) {
      if (request.body[key] == "")
        return response.json({ error: "Please, fill in all fields" })
    }

    Chef.create(request.body, chef => {
      return response.status(201).redirect(`/admin/chefs`)
    })
  },

  show(request, response) {
    const id  = request.params.id

    Chef.find(id, chef => {

      Chef.findRecipesByChef(id, recipes => {
        return response.render("admin/chefs/show", { chef, recipes })
      })
    })
  },

  edit(request, response) {
    Chef.find(request.params.id, chef => {
      return response.render("admin/chefs/edit", { chef })
    })
  },

  update(request, response) {
    const keys = Object.keys(request.body)

    for (key of keys) {
      if (request.body[key] == "")
        return response.json({ error: "Please, fill in all fields" })
    }

    Chef.update(request.body, () => {
      response.status(200).redirect(`/admin/chefs/${request.body.id}`)
    })
  },

  delete(request, response) {
    const id = request.body.id

    Chef.find(id, chef => {

      Chef.findRecipesByChef(id, recipes => {

        if (recipes.length == 0) {
          Chef.delete(id, () => {
            response.status(200).redirect("/admin/chefs")
          })
        }
        else
          response.status(401).json({ err: "You cannot delete this user because there is a recipe registered on him"})
      })
    })
  }
}