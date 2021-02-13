const db = require("../../config/db")

function find(filters, table) {
  try {
    let query = `SELECT * FROM ${table}`

    if (filters) {
      Object.keys(filters).map( key => {
        query += ` ${key}`

        Object.keys(filters[key]).map( field => {
          query += ` ${field} = '${filters[key][field]}'`
        })
      })
    }

    return db.query(query)
  } 
  catch (err) {
    console.error(err)  
  }
}

const Base = {
  init({ table }) {
    if (!table) throw new Error("Invalid params")

    this.table = table

    return this
  },

  async findOne(filters) {
    const results = await find(filters, this.table)

    return results.rows[0]
  },

  async findAll(filters) {
    const results = await find(filters, this.table)

    return results.rows
  },

  async create(fields) {
    try {
      let keys = [], values = []

      Object.keys(fields).map( key => {
        keys.push(key)

        Array.isArray(fields[key])
          ? values.push(`'{"${fields[key].join('","')}"}'`)
          : values.push(`'${fields[key]}'`)
      })

      const query = `
        INSERT INTO ${this.table}
        (${keys.join(",")})
        VALUES (${values.join(",")})
        RETURNING id
      `

      const results = await db.query(query)
      return results.rows[0].id
    } 
    catch (err) {
      console.error(err)  
    }
  },

  update(id, fields) {
    try {
      let update = []

      Object.keys(fields).map( key => {
        const line = `${key} = '${fields[key]}'` // field = ($1 => value)

        update.push(line)
      })

      let query = `
        UPDATE ${this.table} SET
        ${update.join(",")} WHERE id = ${id}
      `

      return db.query(query)
    } 
    catch (err) {
      console.error(err)  
    }
  },

  delete(field, id) {
    return db.query(`DELETE FROM ${this.table} WHERE ${field} = ${id}`)
  },

  async paginate({ limit, offset }) {
    try {
      let query = `
        SELECT ${this.table}.*, (SELECT count(*) FROM ${this.table}) AS total
        FROM ${this.table}
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

module.exports = Base