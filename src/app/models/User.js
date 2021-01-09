const db = require('../../config/db');

module.exports = {
  async create({ name, email, password, is_admin }) {
    try {
      const query = `
        INSERT INTO users (
          name,
          email,
          password,
          is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `

      const values = [
        name,
        email,
        password,
        is_admin
      ]

      const results = await db.query(query, values)
      return results.rows[0].id
    } 
    catch (err) {
      console.error(err)
    }
  },

  async findOne(filters) {
    let query = "SELECT * FROM users"

    Object.keys(filters).map( key => {
      query = `
        ${query}
        ${key}
      ` 

      Object.keys(filters[key]).map ( field => {
        query = `${query} ${field} = '${filters[key][field]}'`
      })
    })

    const results = await db.query(query)
    return results.rows[0]
  }
}