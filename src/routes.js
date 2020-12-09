const express = require("express")
const multer = require("./app/middlewares/multer")
const SiteController = require("./app/controllers/SiteController")
const RecipeController = require("./app/controllers/RecipeController")
const ChefController = require("./app/controllers/ChefController");

const routes = express.Router()
 
// site
.get("/", SiteController.index)
.get("/about", SiteController.about)
.get("/recipes", SiteController.all)
.get("/recipes/:id", SiteController.show)
.get("/chefs", SiteController.chefs)
.get("/results", SiteController.results)

// recipes
.get("/admin/recipes", RecipeController.index)
.get("/admin/recipes/create", RecipeController.create)
.get("/admin/recipes/:id", RecipeController.show)
.get("/admin/recipes/:id/edit", RecipeController.edit)

.post("/admin/recipes", multer.array("images", 5), RecipeController.post)
.put ("/admin/recipes", multer.array("images", 5), RecipeController.update)
.delete("/admin/recipes", RecipeController.delete)

// chefs
.get("/admin/chefs", ChefController.index)
.get("/admin/chefs/create", ChefController.create)
.get("/admin/chefs/:id", ChefController.show)
.get("/admin/chefs/:id/edit", ChefController.edit)

.post("/admin/chefs", multer.array("images", 1), ChefController.post)
.put("/admin/chefs", multer.array("images", 1), ChefController.update)
.delete("/admin/chefs", ChefController.delete)

module.exports = routes