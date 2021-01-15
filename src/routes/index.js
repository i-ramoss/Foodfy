const express = require("express")

const { onlyUsers } = require("../app/middlewares/session")

const routes = express.Router()

const site = require("./site")
const users = require("./users")
const chefs = require("./chefs")
const recipes = require("./recipes")

routes.use(site)
routes.use("/admin", users)
routes.use("/admin/chefs", onlyUsers, chefs)
routes.use("/admin/recipes", onlyUsers, recipes)

module.exports = routes