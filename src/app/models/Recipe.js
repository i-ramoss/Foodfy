const db = require('../../config/db');

const Base = require("./Base")

Base.init({ table: "recipes" })

module.exports = {
  ...Base,

  async search({ filter, limit, offset, userId, isAdmin }) {
    try { 
      let order = "ORDER BY created_at DESC"
      
      let query = "", filterQuery = "", userQuery = "", totalQuery = `(SELECT count(*) FROM recipes) AS total`

      if (!isAdmin && isAdmin !== null) {
        userQuery = `WHERE user_id = ${userId}`
        filterQuery = `AND user_id = ${userId}`
  
        totalQuery = `(SELECT count(*) FROM recipes ${userQuery}) AS total`
      }

      if (filter) {
        filterQuery += ` AND title ILIKE '%${filter}%'`

        order = "ORDER BY updated_at DESC"
      }

      query = `
        SELECT recipes.*, ${totalQuery} 
        FROM recipes
        WHERE 1 = 1
        ${filterQuery}
        ${order}
        LIMIT ${limit} OFFSET ${offset}
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

  async userPaginate({ limit, offset, userId, isAdmin }) {
    let query = "", filterQuery = "", totalQuery = `(SELECT count(*) FROM recipes) AS total`

    if (!isAdmin) {
      filterQuery = `WHERE user_id = ${userId}`

      totalQuery = `(SELECT count(*) FROM recipes ${filterQuery}) AS total`
    }

    query = `
      SELECT recipes.*, ${totalQuery}
      FROM recipes
      ${filterQuery}
      ORDER BY title ASC
      LIMIT ${limit} OFFSET ${offset}
    `

    const results = await db.query(query)
    return results.rows
  }
}