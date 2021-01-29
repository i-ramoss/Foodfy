const { hash } = require("bcryptjs")
const faker = require("faker")

const Base = require("./src/app/models/Base")
const User = require("./src/app/models/User")
const Chef = require("./src/app/models/Chef")
const Recipe = require("./src/app/models/Chef")
const File = require("./src/app/models/File")

let usersIds = []
let totalUsers = 4, totalChefs = 3, totalRecipes = 3, totalFiles = totalRecipes + totalChefs

async function createUsers() {
  const users = []
  const password = await hash("123", 8)

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      is_admin: faker.random.boolean()
    })
  }

  const usersPromise = users.map( user => User.create(user))
  usersIds = await Promise.all(usersPromise)
}

async function createChefs() {
  const chefs = []

  for (let i=1; chefs.length < totalChefs; i++) {
    chefs.push({
      name: faker.name.firstName(),
      file_id: i
    })
  }

  const chefsPromise = chefs.map( chef => Chef.create(chef))
  chefsIds = await Promise.all(chefsPromise)
}

async function createFiles() {
  let files = []

  while(files.length < totalFiles) {
    files.push({
      name: faker.image.image(),
      path: `public/images/placeholder.png`
    })
  }

  const filesPromise = files.map( file => File.create(file))
  filesIds = await Promise.all(filesPromise)
}

async function createRecipes() {
  let recipes = []

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      title: faker.name.title(),
      ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 5)).split(" "),
      preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 5)).split(" "),
      information: faker.lorem.paragraph(Math.ceil(Math.random() * 10))
    })
  }

  const recipesPromise = recipes.map( recipe => Recipe.create(recipe))
  recipesIds = Promise.all(recipesPromise)
}

async function createPivoTableRelations() {
  const relations = []
  let recipesCount = 0

  for (let i = totalChefs + 1; relations.length < totalRecipes; i++) {
    recipesCount++

    relations.push({
      recipe_id: recipesCount,
      file_id: i
    })
  }

  const relationsPromises = relations.map( relation => {
    Base.init({ table: "recipe_files" })

    Base.create(relation)
  })

  await Promise.all(relationsPromises)
}

async function init() {
  await createUsers()
  await createFiles()
  await createChefs()
  await createRecipes()
  await createPivoTableRelations()
}

init()