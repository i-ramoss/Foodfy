const db = require('../../config/db');
const { date } = require("../lib/utils")

module.exports = {
  redirect(request, response) {
    return response.redirect('/admin/recipes')
  },

  index(request, response) {
    return response.render('admin/recipes/index')
  },

  create(request, response) {
    return response.render('admin/recipes/create')
  },

  post(request, response) {
    const keys = Object.keys(request.body)

    for (key of keys) {
      if (request.body[key] == "")
        return response.json({error: "Please, fill in all fields"})
    }

    const query = `
      INSERT INTO recipes (
        image,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `

    const values = [
      request.body.image,
      request.body.ingredients,
      request.body.preparation,
      request.body.information,
      date(Date.now()).iso
    ]

    db.query(query, values, (err, results) => {
      console.log(err)
      console.log(results)

      return
    })
  },

  show(request, response) {
    // const index = request.params.id
    // const item = {
    //   id: index,
    //   ...data.recipes[index]
    // }

    // if(!data.recipes[index]) 
    //   return response.status(404).render('admin/recipes/not-found')

    return response.render('admin/recipes/show')
  },

  edit(request, response) {
    // const index = request.params.id
    // const item = {
    //   id: index,
    //   ...data.recipes[index]
    // }
      
    // if(!item) 
    //   return response.status(404).render('admin/recipes/not-found')
  
    return response.render('admin/recipes/edit')
  },

  update(request, response) {
    const keys = Object.keys(request.body)
    
    for (key of keys) {
      if (request.body[key] == "")
      return response.json({error: "Please, fill in all fields"})
    }
    
    // const index = request.body.id
    // const item = {
    //   ...data.recipes[index],
    //   ...request.body
    // }
  
    // if(!item) 
    //   return response.status(404).render('admin/recipes/not-found')

    return
  },

  delete(request, response) {
    return
  }
}
