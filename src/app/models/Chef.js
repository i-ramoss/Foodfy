const db = require("../../config/db")

const fs = require("fs")

const Base = require("./Base")

Base.init({ table: "chefs" })

module.exports = {
  ...Base,

  all() {
    try {
      return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY chefs.name ASC`
      )
    } 
    catch (erro) {
      console.error(err)
    }
  },

  find(id) {
    try {
      return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id]
      ) 
    } 
    catch (err) {
      console.error(err)
    }
  },

  findRecipesByChef(id) {
    try {
      return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        INNER JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
        ORDER BY recipes.title ASC`, [id]
      )
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