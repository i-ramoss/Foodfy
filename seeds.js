const { hash } = require("bcryptjs")
const faker = require("faker")

const Base = require("./src/app/models/Base")
const User = require("./src/app/models/User")
const Chef = require("./src/app/models/Chef")
const Recipe = require("./src/app/models/Recipe")
const File = require("./src/app/models/File")

let usersIds = [], chefsIds = []
let totalUsers = 4, totalChefs = 3, totalRecipes = 3, totalFiles = totalRecipes + totalChefs

async function createUsers() {
  console.time("Creating Users")

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

  console.timeEnd("Creating Users")
}

async function createChefs() {
  console.time("Creating Chefs")

  const chefs = []

  for (let i=1; chefs.length < totalChefs; i++) {
    chefs.push({
      name: faker.name.firstName(),
      file_id: i
    })
  }

  const chefsPromise = chefs.map( chef => Chef.create(chef))
  chefsIds = await Promise.all(chefsPromise)

  console.timeEnd("Creating Chefs")
}

async function createFiles() {
  console.time("Creating Recipes and Users files")

  let files = []

  while(files.length < totalFiles) {
    files.push({
      name: faker.image.image(),
      path: `public/images/placeholder.png`
    })
  }

  const filesPromise = files.map( file => File.create(file))
  filesIds = await Promise.all(filesPromise)

  console.timeEnd("Creating Recipes and Users files")
}

async function createRecipes() {
  console.time("Creating Recipes")

  let recipes = []

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      title: faker.name.title(),
      ingredients: `{${faker.lorem.paragraph(Math.ceil(Math.random() * 5))}}`,
      preparation: `{${faker.lorem.paragraph(Math.ceil(Math.random() * 5))}}`,
      information: faker.lorem.paragraph(Math.ceil(Math.random() * 10))
    })
  }

  const recipesPromise = recipes.map( recipe => Recipe.create(recipe))
  recipesIds = await Promise.all(recipesPromise)

  console.timeEnd("Creating Recipes")
}

async function createPivoTableRelations() {
  console.time("Creating files connection with recipe_files")

  const relations = []
  let recipesCount = 1

  for (let i = totalChefs + 1; relations.length < totalRecipes; i++) {
    relations.push({
      recipe_id: recipesCount,
      file_id: i
    })

    recipesCount++
  }

  const relationsPromises = relations.map( relation => {
    Base.init({ table: 'recipe_files' })

    Base.create(relation)
  })

  await Promise.all(relationsPromises)

  console.timeEnd("Creating files connection with recipe_files")
}

async function init() {
  await createUsers()
  await createFiles()
  await createChefs()
  await createRecipes()
  await createPivoTableRelations()
}

init()