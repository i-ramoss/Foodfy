const express = require("express")
const multer = require("./app/middlewares/multer")
const site = require("./app/controllers/site")
const recipes = require("./app/controllers/recipes")
const chefs = require("./app/controllers/chefs");

const routes = express.Router()
 
// site
.get("/", site.index)
.get("/about", site.about)
.get("/recipes", site.all)
.get("/recipes/:id", site.show)
.get("/chefs", site.chefs)
.get("/results", site.results)

// recipes
.get("/admin/recipes", recipes.index)
.get("/admin/recipes/create", recipes.create)
.get("/admin/recipes/:id", recipes.show)
.get("/admin/recipes/:id/edit", recipes.edit)

.post("/admin/recipes", multer.array("images", 5), recipes.post)
.put ("/admin/recipes", multer.array("images", 5), recipes.update)
.delete("/admin/recipes", recipes.delete)

// chefs
.get("/admin/chefs", chefs.index)
.get("/admin/chefs/create", chefs.create)
.get("/admin/chefs/:id", chefs.show)
.get("/admin/chefs/:id/edit", chefs.edit)

.post("/admin/chefs", multer.array("avatar", 1), chefs.post)
.put("/admin/chefs", multer.array("avatar", 1), chefs.update)
.delete("/admin/chefs", chefs.delete)

module.exports = routes