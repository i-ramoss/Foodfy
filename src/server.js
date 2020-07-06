const express = require('express')
const nunjucks = require('nunjucks')


const server = express()
const recipes = require('./data')


server.use(express.static('public'))
server.set('view engine', 'njk')


nunjucks.configure('src/views', {
  express: server,
  autoescape: false,
  noCache: true
})


server.get('/', (require, response) => {
  const info = {
    t1: 'As melhores receitas',
    t2: 'Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.',
    title: 'Foodfy'
  }

  return response.render('index', { recipes: recipes, info })
})

server.get('/recipes', (require, response) => {
  const info = {
    about: 'Sobre',
    recipes: 'Receitas',
    title: 'Receitas - Foodfy'
  }

  return response.render('recipes', { recipes: recipes, info })
})

server.get('/about', (require, response) => {
  const info = {
    about: 'Sobre',
    recipes: 'Receitas',
    title: 'Sobre - Foodfy',

    about_foodfy: 'Sobre o Foodfy:',
    start: 'Como tudo começou..',
    our_recipes: 'Nossas receitas:',
  }
    
  return response.render('about', { info })
})

server.get('/recipes/:index', (require, response) => {
  const recipeIndex = require.params.index
  const info = {
    ingredients: 'Ingredientes',
    hide: 'ESCONDER',
    show: 'MOSTRAR',
    make: 'Modo de preparo',
    adittional: 'Informações adicionais'
  }
    
  if(!recipes[recipeIndex]) {
    const error = { name: 'Receita não existente'}
    
    return response.status(404).render('not-found', { error })
  }
  
  
  return response.render('recipe', { item: recipes[recipeIndex], info})
})

// Página não encontrada
server.use( (require, response) => {
  const error = { name: 'Página não encontrada' }

  response.status(404).render('not-found', { error })
})


server.listen(3000, () => {
  console.log('The server is running successfully on port 3000')
})