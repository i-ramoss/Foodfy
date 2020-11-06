const db = require('../../config/db');
const { date } = require("../lib/utils")

module.exports = {
  all(callback) {
    db.query(`
    SELECT recipes.*, chefs.name AS chef_name 
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    ORDER BY recipes.title ASC`, (err, results) => {
      if (err) throw `Index Error! ${err}`

      callback(results.rows)
    })
  },

  create(data, callback) {
    const query = `
      INSERT INTO recipes (
        title, 
        image,
        chef_id,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `

    const values = [
      data.title,
      data.image,
      data.chef,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `Create Error! ${err}`
  
      callback(results.rows[0])
    })
  },

  find(id, callback) {
    db.query(`
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes 
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.id = $1`, [id], (err, results) => {
      if (err) throw `Find Error! ${err}`

      callback(results.rows[0])
    })
  },

  findBy(filter, callback) {
    db.query(`
    SELECT recipes.*, chefs.name AS chef_name 
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.title ILIKE '%${filter}%'
    ORDER BY recipes.title ASC`, (err, results) => {
      if (err) throw `Filter Error! ${err}`

      callback(results.rows)
    })
  },

  update(data, callback) {
    const query = `
      UPDATE recipes SET
        title=($1),
        image=($2),
        chef_id=($3),
        ingredients=($4),
        preparation=($5),
        information=($6)
      WHERE id = $7
    `
    const values = [
      data.title,
      data.image,
      data.chef,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ]
  
    db.query(query, values, (err, results) => {
      if(err) throw `Update Error! ${err}`

      callback()
    })
  },

  delete(id, callback) {
    db.query(`
      DELETE FROM recipes 
      WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Delete Error! ${err}`

      return callback()
    })
  },

  chefSelectOptions(callback) {
    db.query(`
    SELECT name, id FROM chefs`, (err, results) => {
      if (err) throw `Select Chef Error! ${err}`

      callback(results.rows)
    })
  }
}