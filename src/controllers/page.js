const data = require('../../data.json')

exports.index = (require, response) => {
  const info = {
    t1: 'The best recipes',
    t2: 'Learn how to build the best dishes with recipes created by professionals from all over the world.',
    title: 'Foodfy'
  }

  return response.render('index', { data: data.recipes, info })
}

exports.about = (require, response) => {
  const info = {
    title: 'About - Foodfy',

    about_foodfy: 'About Foodfy:',
    start: 'How it all began..',
    our_recipes: 'Our recipes:',
  }
    
  return response.render('about', { info })
}

exports.all = (require, response) => {
  const info = {
    title: 'Recipes - Foodfy'
  }

  return response.render('recipes', { data: data.recipes, info })
}

exports.show = (require, response) => {
  const recipeIndex = require.params.index
  const info = {
    ingredients: 'Ingredients',
    hide: 'HIDE',
    show: 'SHOW',
    make: 'Preparation mode:',
    adittional: 'Additional Information:'
  }
  const item = data.recipes[recipeIndex]
  
  if(!item) {
    const error = { name: 'Receita não existente'}
    
    return response.status(404).render('not-found', { error })
  }
  
  return response.render('recipe', { item, info})
}