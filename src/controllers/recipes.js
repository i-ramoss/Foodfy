const fs = require('fs')
const data = require('../../data.json')

exports.redirect = (request, response) => {
  return response.redirect('/admin/recipes')
}

exports.index = (request, response) => {
  return response.render('admin/recipes/index', { data: data.recipes })
}

exports.create = (request, response) => {
  return response.render('admin/recipes/create')
}

exports.post = (request, response) => {
  const keys = Object.keys(request.body)

  for (key of keys) {
    if (request.body[key] == "")
      return response.send("Please fill in all fields!")
  }

  data.recipes.push(request.body)

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return response.send("Write file error!")

    return response.redirect("/admin/recipes")
  })
}

exports.show = (request, response) => {
  const index = request.params.id
  const item = {
    id: index,
    ...data.recipes[index]
  }

  if(!data.recipes[index]) {
    const error = { name: 'Non-existent recipe'}

    return response.status(404).render('admin/recipes/not-found', { error })
  }
  
  return response.render('admin/recipes/show', { item })
}

exports.edit = (request, response) => {
  const index = request.params.id
  const item = {
    id: index,
    ...data.recipes[index]
  }
    
  if(!item) 
    return response.status(404).render('admin/recipes/not-found')

  return response.render('admin/recipes/edit', { item })
}

exports.update = (request, response) => {
  const index = request.body.id
  const keys = Object.keys(request.body)

  for (key of keys) {
    if (request.body[key] == "")
      return response.send("Please fill in all fields!")
  }

  const item = {
    ...data.recipes[index],
    ...request.body
  }

  if(!item) 
    return response.status(404).render('admin/recipes/not-found')

  data.recipes[index] = item

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if(err) return response.send("Write file error!")

    return response.redirect(`/admin/recipes/${index}`)
  })
}
    
exports.delete = (request, response) => {
  const index = request.body.id

  const filteredRecipes = data.recipes.filter((recipe, index) => {
    return request.body.id != index
  })

  data.recipes = filteredRecipes

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if(err) return response.send("Write file error")

    return response.redirect("/admin/recipes")
  })
}
