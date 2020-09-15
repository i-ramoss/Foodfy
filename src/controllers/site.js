const data = require('../../data.json')

exports.index = (request, response) => {
  return response.render('site/index', { data: data.recipes })
}

exports.about = (request, response) => {
  return response.render('site/about')
}

exports.all = (request, response) => {
  return response.render('site/recipes', { data: data.recipes })
}

exports.show = (request, response) => {
  const index = request.params.index
  const item = data.recipes[index]
  
  if(!item) {
    const error = { name: 'Receita não existente'}
    
    return response.status(404).render('site/not-found', { error })
  }
  
  return response.render('site/recipe', { item })
}