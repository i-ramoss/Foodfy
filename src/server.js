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
  const txt = {
    t1: 'As melhores receitas',
    t2: 'Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.'
  }

  return response.render('index', { recipes: recipes, txt })
})

server.get('/recipes', (require, response) => {
  return response.render('recipes', { recipes: recipes })
})

server.get('/about', (require, response) => {
  return response.render('about')
})

server.get('/recipes/:index', (require, response) => {
  const recipeIndex = require.params.index

  const recipe = recipes.find((recipe) => {
    return recipe.index == recipeIndex
  })

  return response.render('course', { data: recipes[recipeIndex] })

})




server.listen(3000, () => {
  console.log('The server is running successfully on port 3000')
})