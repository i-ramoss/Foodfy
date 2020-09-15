const express = require('express')
const site = require('./controllers/site')
const recipes = require('./controllers/recipes')

const routes = express.Router()
 
// main
.get('/', site.index)
.get('/about', site.about)
.get('/recipes', site.all)
.get('/recipes/:index', site.show)

// admin
.get('/admin', recipes.redirect)
.get('/admin/recipes', recipes.index)
.get('/admin/recipes/create', recipes.create)
.get('/admin/recipes/:id', recipes.show)
.get('/admin/recipes/:id/edit', recipes.edit)

.post('/admin/recipes', recipes.post)
.put ('/admin/recipes', recipes.update)
.delete('/admin/recipes', recipes.delete)



module.exports = routes