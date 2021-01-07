const express = require("express")

const routes = express.Router()

const site = require("./site")
const users = require("./users")
const chefs = require("./chefs")
const recipes = require("./recipes")

routes.use(site)
routes.use("/users", users)
routes.use("/admin/chefs", chefs)
routes.use("/admin/recipes", recipes)

module.exports = routes