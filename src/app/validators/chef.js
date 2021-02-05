async function create(request, response, next) {
  const keys = Object.keys(request.body)

  for (key of keys) {
    if (request.body[key] === "")
      return response.render("admin/chefs/create", {
        chef: request.body,
        error: "Please, fill in all fields"
      })
  }

  if(request.files.length === 0) {
    return response.render("admin/chefs/create", {
      chef: request.body,
      error: "Please, send at least one image!"
    })
  }

  next()
}

async function update(request, response, next) {
  const keys = Object.keys(request.body)

  for (key of keys) {
    if (request.body[key] === "" & key !== "removed_files")
      return response.render("admin/chefs/create", {
        chef: request.body,
        error: "Please, fill in all fields"
      })
  }

  next()
}

module.exports = {
  create,
  update
}