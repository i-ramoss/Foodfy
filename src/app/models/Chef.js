const db = require("../../config/db")
const { date } = require("../lib/utils")

module.exports = {
  all() {
    return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      GROUP BY chefs.id
      ORDER BY chefs.name ASC`
    )
  },

  create(data) {
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

    return db.query(query, values)
  },

  find(id) {
    return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`, [id]
    )
  },

  findRecipesByChef(id) {
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      INNER JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE chefs.id = $1`, [id]
    )
  },

  update(data) {
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

    return db.query(query, values)
  },

  delete(id) {
    return db.query(`
      DELETE FROM chefs
      WHERE id = $1`, [id]
    )
  }
}