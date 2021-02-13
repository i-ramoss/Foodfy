const db = require("../../config/db")

const Base = require("./Base")

Base.init({ table: "chefs" })

module.exports = {
  ...Base,

  async files(id) {
    try {
      const query = `
        SELECT * FROM files
        LEFT JOIN chefs ON (chefs.file_id = files.id)
        WHERE chefs.id = ${id}
      `
      
      const results = await db.query(query)
      return results.rows
    } 
    catch (err) {
      console.error(err)
    }
  },

  async search({ filter, limit, offset }) {
    try {
      let query = "", filterQuery = ""

      if (filter) filterQuery = `AND chefs.name ILIKE '%${filter}%'`

      query = `
        SELECT chefs.*, (SELECT count(*) FROM chefs) AS total
        FROM chefs
        WHERE 1 = 1
        ${filterQuery}
        ORDER BY chefs.name ASC
        LIMIT ${limit} OFFSET ${offset}
      `
      
      const results = await db.query(query)
      return results.rows
    } 
    catch (err) {
      console.error(err)  
    }
  }
}