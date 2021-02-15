const express = require("express")

const SiteController = require("../app/controllers/SiteController")
const SearchController = require("../app/controllers/SearchController")

const routes = express.Router()

.get("/", SiteController.index)
.get("/about", SiteController.about)
.get("/recipes", SiteController.all)
.get("/recipes/:id", SiteController.show)
.get("/chefs", SiteController.chefs)
.get("/chefs/:id", SiteController.showChef)
.get("/results", SearchController.siteRecipes)


module.exports = routes