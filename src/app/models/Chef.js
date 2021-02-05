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
  }
}