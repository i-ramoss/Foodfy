const db = require("../../config/db")

const Base = require("./Base")

Base.init({ table: "users" })

module.exports = {
  ...Base,

  async search({ filter }) {
    try {
      let query = "", filterQuery = ""

      if (filter) {
        filterQuery = `
          AND (users.name ILIKE '%${filter}%' OR users.email ILIKE '%${filter}%')
        `
      }
      
      query = `
        SELECT * from users
        WHERE 1 = 1
        ${filterQuery}
        ORDER BY users.name ASC
      `

      const results = await db.query(query)
      return results.rows
    } 
    catch (err) {
      console.error(err)  
    }
  }
}