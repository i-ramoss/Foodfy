const db = require('../../config/db');

module.exports = {
  async create({ name, email, is_admin }) {
    try {
      const query = `
        INSERT INTO users (
          name,
          email,
          is_admin
        ) VALUES ($1, $2, $3)
        RETURNING id
      `

      const values = [
        name,
        email,
        is_admin || false
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
  },

  async update(id, fields) {
    let query = "UPDATE users SET"

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
          WHERE id = ${id}
        `
      }
    })

    await db.query(query)
    return
  }
}