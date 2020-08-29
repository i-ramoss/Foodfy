const express = require('express')
const routes = require('./routes')
const nunjucks = require('nunjucks')

const server = express()

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))
server.use(routes)
server.use( (require, response) => {
  const error = { name: 'Page not-found!' }

  response.status(404).render('not-found', { error })
})
server.set('view engine', 'njk')

nunjucks.configure('src/views', {
  express: server,
  autoescape: false,
  noCache: true
})


server.listen(5000, () => {
  console.log('The server is running successfully on port 5000')
}) 