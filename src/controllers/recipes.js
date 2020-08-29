const fs = require('fs')
const data = require('../../data.json')

exports.redirect = (require, response) => {
  return response.redirect('/admin/recipes')
}

exports.index = (require, response) => {
  const info = {
    title: 'Admin - Recipes'
  }

  return response.render('admin/recipes/index', { data: data.recipes, info })
}

exports.create = (require, response) => {
  const info = {
    save: 'Save recipe',
    create: 'Creating recipe:',
    img: 'Recipe image:',
    ingredients: 'Ingredients:',
    addIng: 'Add new ingredient:',
    addStep: 'Add new step:',
    preparation: 'Preparation mode:',
    info: 'Additional information:'
  }

  return response.render('admin/recipes/create', { info })
}

exports.show = (require, response) => {
  const recipeIndex = require.params.id
  const info = {
    edit: 'Edit recipe',
    recipe: 'Recipe:',
    button: 'Edit recipe',
    ingredients: 'Ingredients:',
    make: 'Preparation mode:',
    adittional: 'Additional information:'
  }

  const item = {
    id: recipeIndex,
    ...data.recipes
  }
    
  if(!item[recipeIndex]) {
    const error = { name: 'Non-existent recipe'}

    return response.status(404).render('admin/recipes/not-found', { error })
  }
  
  return response.render('admin/recipes/show', { item: item[recipeIndex], info})
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

exports.edit = (require, response) => {
  return response.send('everything okay on edit')
}
