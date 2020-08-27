const data = require('../data')

exports.index = (require, response) => {
  const info = {
    about: 'Sobre',
    recipes: 'Receitas',
    title: 'Admin - Recipes'
  }

  return response.render('admin/recipes/index', { data, info })
}

exports.create = (require, response) => {
  return response.send('everything okay on create')
}

exports.show = (require, response) => {
  const recipeIndex = require.params.index
  const info = {
    recipe: 'Receita:',
    button: 'Editar receita',
    ingredients: 'Ingredientes',
    make: 'Modo de preparo',
    adittional: 'Informações adicionais'
  }
    
  if(!data[recipeIndex]) {
    const error = { name: 'Receita não existente'}
    
    return response.status(404).render('not-found', { error })
  }
  
  return response.render('admin/recipes/show', { item: data[recipeIndex], info})
}

exports.edit = (require, response) => {
  return response.send('everything okay on edit')
}
