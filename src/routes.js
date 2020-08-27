const express = require('express')
const page = require('./controllers/page')
const recipes = require('./controllers/recipes')

const routes = express.Router()

// main
.get('/', page.index)
.get('/about', page.about)
.get('/recipes', page.all)
.get('/recipes/:index', page.show)

// admin
.get('/admin/recipes', recipes.index)
.get('/admin/recipes/create', recipes.create)
.get('/admin/recipes/:index', recipes.show)
.get('/admin/recipes/:id/edit', recipes.edit)



module.exports = routes