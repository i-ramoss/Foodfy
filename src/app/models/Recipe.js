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

  paginate(params) {
    try {
      const { filter, limit, offset } = params

      let query = "",
          filterQuery = ""
          totalQuery = `(
            SELECT count(*) from recipes
          ) AS total`
      
      if (filter) {
        filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`
        totalQuery = `(
          SELECT count(*) FROM recipes
          ${filterQuery}
        ) AS total`
      }

      query = `
      SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      ORDER BY updated_at DESC
      LIMIT $1 OFFSET $2
      `

      return db.query(query, [limit, offset])
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