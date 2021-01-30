const db = require('../../config/db');

const fs = require("fs")

const Base = require("./Base")

Base.init({ table: "recipes" })

module.exports = {
  ...Base,

  async all() {
    try {
      const results = await db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC
      `) 

      return results.rows
    } 
    catch (err) {
      console.error(err)
    }
  },

  find(id) {
    try {
      return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id]
      )
    } 
    catch (err) {
      console.error(err)
    }
  },

  findBy(filter) {
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name 
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      ORDER BY recipes.title ASC
    `)
  },

  async update(recipeId, fields) {
    let query = "UPDATE recipes SET"

    Object.keys(fields).map( (key, index, array) => {
      if ((index + 1) < array.length) {
        query = `
          ${query}
          ${key} = '${fields[key]}',
        `
      }
      else {
        query = `
          ${query}
          ${key} = '${fields[key]}'
          WHERE id = ${recipeId}
        `
      }
    })

    await db.query(query)
    return
  },

  async delete(id) {
    try{
      const results = await db.query(`
        SELECT * FROM files
        INNER JOIN recipe_files ON (files.id = recipe_files.file_id)
        WHERE recipe_files.recipe_id = $1`, [id]
      )
      
      const removedFiles = results.rows.map( async file => {
        fs.unlinkSync(file.path)
  
        await db.query(`DELETE FROM recipe_files WHERE recipe_files.file_id = $1`, [file.file_id])
        await db.query(`DELETE FROM files WHERE id = $1`, [file.file_id])
      })
  
      return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    }
    catch(err){
      console.error(err)
    }
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

  files(id) {
    try {
      return db.query(`
        SELECT files.* FROM files
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
        WHERE recipe_files.recipe_id = $1`, [id]
      )
    } catch (err) {
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