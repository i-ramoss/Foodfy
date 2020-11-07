const db = require("../../config/db")
const { date } = require("../lib/utils")

module.exports = {
  all(callback) {
    db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      ORDER BY chefs.name ASC`, (err, results) => {
      if(err) throw `Index Error! ${err}`

      callback(results.rows)
    })
  },

  create(data, callback) {
    const query = `
      INSERT INTO chefs (
        name,
        avatar_url,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `

    const values = [
      data.name,
      data.avatar_url,
      date(Date.now()).iso
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `Create Error! ${err}`

      callback(results.rows[0])
    })
  },

  find(id, callback) {
    db.query(`
    SELECT chefs.*, count(recipes) AS total_recipes
    FROM chefs
    LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
    WHERE chefs.id = $1
    GROUP BY chefs.id`, [id], (err, results) => {
      if (err) throw `Find Error! ${err}`

      callback(results.rows[0])
    })
  },

  findRecipesByChef(id, callback) {
    db.query(`
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    INNER JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE chefs.id = $1`, [id], (err, results) => {
      if (err) throw `Find By Chef Error! ${err}`

      callback(results.rows)
    })
  },

  update(data, callback) {
    const query = `
      UPDATE chefs SET
        name=($1),
        avatar_url=($2)
      WHERE id = $3
    `

    const values = [
      data.name,
      data.avatar_url,
      data.id
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Update Error! ${err}`

      callback()
    })
  },

  delete(id, callback) {
    db.query(`
    DELETE FROM chefs
    WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Delete Error! ${err}`

      return callback()
    })
  }
}