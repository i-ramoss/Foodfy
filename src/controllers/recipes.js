const fs = require('fs')
const data = require('../../data.json')

exports.redirect = (require, response) => {
  return response.redirect('/admin/recipes')
}

exports.index = (require, response) => {
  return response.render('admin/recipes/index', { data: data.recipes })
}

exports.create = (require, response) => {
  return response.render('admin/recipes/create')
}

exports.post = (require, response) => {
  const keys = Object.keys(require.body)

  for (key of keys) {
    if (require.body[key] == "")
      return response.send("Please fill in all fields!")
  }

  data.recipes.push(require.body)

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return response.send("Write file error!")

    return response.redirect("/admin/recipes")
  })
}

exports.show = (require, response) => {
  const index = require.params.id
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

exports.edit = (require, response) => {
  const index = require.params.id
  const item = {
    id: index,
    ...data.recipes[index]
  }
    
  if(!data.recipes[index]) 
    return response.status(404).render('admin/recipes/not-found', { error })

  return response.render('admin/recipes/edit', { item })
}

exports.put = (require, response) => {

}
