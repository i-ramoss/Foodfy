const Chef = require("../models/Chef")
const File = require("../models/File")

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

  let results = await Chef.files(request.body.id)
  let id = results.rows[0].id

  if (request.files.length != 0) {
    const newFilesPromise = request.files.map( file => File.createChefFile({ ...file }))
    
    results = await newFilesPromise[0]
    id = results.rows[0].id
  }

  request.chef_id = id

  next()
}

module.exports = {
  create,
  update
}