const db = require("../../config/db")

const fs = require("fs")

const Base = require("./Base")

Base.init({ table: "chefs" })

module.exports = {
  ...Base,

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

  async files(id) {
    try {
      const query = `
        SELECT files.* FROM files
        LEFT JOIN chefs ON (files.id = chefs.file_id)
        WHERE chefs.id = ${id}
      `
      
      const results = await db.query(query)
      return results.rows[0]
    } 
    catch (err) {
      console.error(err)
    }
  }
}