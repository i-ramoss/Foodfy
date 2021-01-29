const { hash } = require("bcryptjs")

const User = require("./src/app/models/User")

async function createUsers(){
  const users = []
  const password = await hash("123", 8)

  while(users.length < 3) {
    users.push({
      name:
    })
  }
}