const db = require('../../config/db');
const { date } = require("../lib/utils")

module.exports = {
  all(callback) {
    db.query(`
      SELECT * 
      FROM recipes`, (err, results) => {
      if (err) throw `Index Error! ${err}`

      callback(results.rows)
    })
  },

  create(data, callback) {
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
      data.image,
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
    SELECT * 
    FROM recipes 
    WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Find Error! ${err}`

      callback(results.rows[0])
    })
  },

  findBy() {

  },

  update(data, callback) {
    const query = `
      UPDATE recipes SET
        image=($1),
        ingredients=($2),
        preparation=($3),
        information=($4)
      WHERE id = $5
    `
    const values = [
      data.image,
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
  }
}