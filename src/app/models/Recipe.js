const db = require('../../config/db');
const fs = require("fs")
const { date } = require("../lib/utils")

module.exports = {
  all() {
    try {
      return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.title ASC
      `) 
    } 
    catch (err) {
      console.error(err)
    }
  },

  create(data) { 
    try {
      const query = `
        INSERT INTO recipes (
          title, 
          chef_id,
          ingredients,
          preparation,
          information,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `
      const values = [
        data.title,
        data.chef,
        data.ingredients,
        data.preparation,
        data.information,
        date(Date.now()).iso
      ]

      return db.query(query, values)
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

  update(data) {
    try {
      const query = `
        UPDATE recipes SET
          title=($1),
          chef_id=($2),
          ingredients=($3),
          preparation=($4),
          information=($5)
        WHERE id = $6
      `
      const values = [
        data.title,
        data.chef,
        data.ingredients,
        data.preparation,
        data.information,
        data.id
      ]
    
      return db.query(query, values)
    } 
    catch (err) {
      console.error(err)
    }
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

  chefSelectOptions() {
    try {
      return db.query(`SELECT name, id FROM chefs`) 
    } 
    catch (err) {
      console.error(err)
    }
  },

  paginate(params) {
    try {
      const { filter, limit, offset, callback } = params

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
      ORDER BY recipes.title ASC
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
  }
}