const db = require('../../config/db');

const Base = require("./Base")

Base.init({ table: "recipes" })

module.exports = {
  ...Base,

  findBy(filter) {
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name 
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      ORDER BY recipes.title ASC
    `)
  },

  async search({ filter }) {
    try { 
      let order = "ORDER BY recipes.created_at DESC"

      let query = "", filterQuery = ""

      if (filter) {
        filterQuery = `AND recipes.title ILIKE '%${filter}%'`

        order = "ORDER BY recipes.updated_at DESC"
      }

      query = `
        SELECT * FROM recipes
        WHERE 1 = 1
        ${filterQuery}
        ${order}
      `

      const results = await db.query(query)
      return results.rows
    } 
    catch (err) {
      console.error(err)  
    }
  },

  async files(id) {
    try {
      const query = `
        SELECT * FROM files
        LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = ${id}
      `
      
      const results = await db.query(query)
      return results.rows
    } 
    catch (err) {
      console.error(err)
    }
  },

  async userRecipes(userId) {
    try {
      const results = await db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        LEFT JOIN users ON (recipes.user_id = users.id)
        WHERE users.id = $1`, [userId]
      )

      return results.rows
    } 
    catch (err) {
      console.error(err)  
    }
  }
}