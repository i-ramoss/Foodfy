const data = require('../../data.json')

exports.index = (require, response) => {
  return response.render('index', { data: data.recipes })
}

exports.about = (require, response) => {
  return response.render('about')
}

exports.all = (require, response) => {
  return response.render('recipes', { data: data.recipes })
}

exports.show = (require, response) => {
  const index = require.params.index
  const item = data.recipes[index]
  
  if(!item) {
    const error = { name: 'Receita não existente'}
    
    return response.status(404).render('not-found', { error })
  }
  
  return response.render('recipe', { item })
}