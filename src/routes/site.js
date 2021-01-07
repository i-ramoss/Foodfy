const express = require("express")

const SiteController = require("../app/controllers/SiteController")

const routes = express.Router()

.get("/", SiteController.index)
.get("/about", SiteController.about)
.get("/recipes", SiteController.all)
.get("/recipes/:id", SiteController.show)
.get("/chefs", SiteController.chefs)
.get("/results", SiteController.results)


module.exports = routes