const express = require('express')
const routes = require('./routes')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')

const server = express()

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))
server.use(methodOverride('_method'))
server.use(routes)
server.use( (request, response) => {
  response.status(404).render('site/not-found') 
})
server.set('view engine', 'njk')

nunjucks.configure('src/app/views', {
  express: server,
  autoescape: false,
  noCache: true
})


server.listen(5000, () => {
  console.log('The server is running successfully on port 5000')
}) 