
module.exports = {
  index(request, response) {
    return response.render('site/index')
  },
  
  about(request, response) {
    return response.render('site/about')
  },

  all(request, response) {
    return response.render('site/recipes')
  },

  show(request, response) {
    const index = request.params.index
    const item = data.recipes[index]
    
    if(!item) 
      return response.status(404).render('site/not-found')
    
    return response.render('site/recipe')
  }
}
