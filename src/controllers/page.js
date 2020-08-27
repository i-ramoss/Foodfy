const data = require('../data')

exports.index = (require, response) => {
  const info = {
    t1: 'As melhores receitas',
    t2: 'Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.',
    title: 'Foodfy'
  }

  return response.render('index', { data, info })
}

exports.about = (require, response) => {
  const info = {
    about: 'Sobre',
    recipes: 'Receitas',
    title: 'Sobre - Foodfy',

    about_foodfy: 'Sobre o Foodfy:',
    start: 'Como tudo começou..',
    our_recipes: 'Nossas receitas:',
  }
    
  return response.render('about', { info })
}

exports.all = (require, response) => {
  const info = {
    about: 'Sobre',
    recipes: 'Receitas',
    title: 'Receitas - Foodfy'
  }

  return response.render('recipes', { data, info })
}

exports.show = (require, response) => {
  const recipeIndex = require.params.index
  const info = {
    ingredients: 'Ingredientes',
    hide: 'ESCONDER',
    show: 'MOSTRAR',
    make: 'Modo de preparo',
    adittional: 'Informações adicionais'
  }
    
  if(!data[recipeIndex]) {
    const error = { name: 'Receita não existente'}
    
    return response.status(404).render('not-found', { error })
  }
  
  return response.render('recipe', { item: data[recipeIndex], info})
}