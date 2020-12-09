const db = require("../../config/db")
const fs = require("fs")
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

  create(data, file_id) {
    const query = `
      INSERT INTO chefs (
        name,
        file_id,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `

    const values = [
      data.name,
      file_id,
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

  update(data, file_id) {
    try {
      const query = `
        UPDATE chefs SET
          name=($1),
          file_id=($2)
        WHERE id = $3
      `

      const values = [
        data.name,
        file_id,
        data.id
      ]

      return db.query(query, values)   
    } 
    catch (err) {
      console.error(err)
    }
  },

  async delete(id) {
    try {
      const results = await db.query(`
        SELECT files.* FROM files
        INNER JOIN chefs ON (files.id = chefs.file_id)
        WHERE chefs.id = $1`, [id]
      )
      const removedFiles = results.rows.map( async file => {
        fs.unlinkSync(file.path)

        await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
        return db.query(`DELETE FROM files WHERE id = $1`, [file.id])
      })
    }
    catch (err) {
      console.error(err)
    }
  },

  files(id) {
    try {
      return db.query(`
        SELECT files.* FROM files
        LEFT JOIN chefs ON (files.id = chefs.file_id)
        WHERE chefs.id = $1`, [id]
      )
    } 
    catch (err) {
      console.error(err)
    }
  }
}