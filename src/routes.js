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
.get('/admin', recipes.redirect)
.get('/admin/recipes', recipes.index)
.get('/admin/recipes/create', recipes.create)
.get('/admin/recipes/:id', recipes.show)
.get('/admin/recipes/:id/edit', recipes.edit)

.post('/admin/recipes', recipes.post)
.put ('/admin/recipes', recipes.put)



module.exports = routes