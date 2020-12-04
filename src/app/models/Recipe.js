const db = require('../../config/db');
const { date } = require("../lib/utils")

module.exports = {
  all() {
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name 
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY recipes.title ASC
    `)
  },

  create(data) { 
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
  },

  find(id) {
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`, [id]
    )
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
    const query = `
      UPDATE recipes SET
        title=($1),
        image=($2),
        chef_id=($3),
        ingredients=($4),
        preparation=($5),
        information=($6)
      WHERE id = $7
    `
    const values = [
      data.title,
      data.image,
      data.chef,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ]
  
    return db.query(query, values)
  },

  delete(id) {
    return db.query(`
      DELETE FROM recipes 
      WHERE id = $1`, [id]
    )
  },

  chefSelectOptions() {
    return db.query(`SELECT name, id FROM chefs`)
  },

  paginate(params) {
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
}