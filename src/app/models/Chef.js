const db = require("../../config/db")

module.exports = {
  all(callback) {
    db.query(`
      SELECT * 
      FROM chefs`, (err, results) => {
        if(err) throw `Index Error! ${err}`

        callback(results.rows)
      })
  }
}