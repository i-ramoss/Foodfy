const express = require("express")
const multer = require("../app/middlewares/multer")

const RecipeValidator = require("../app/validators/recipe")

const RecipeController = require("../app/controllers/RecipeController")
const SearchController = require("../app/controllers/SearchController")

const routes = express.Router()

.get("/search", SearchController.adminRecipes)

.get("/", RecipeController.index)
.get("/create", RecipeController.create)
.get("/:id", RecipeValidator.permission, RecipeController.show)
.get("/:id/edit", RecipeValidator.permission, RecipeController.edit)

.post("/", multer.array("images", 5), RecipeValidator.create, RecipeController.post)
.put ("/", multer.array("images", 5), RecipeValidator.update, RecipeController.update)
.delete("/", RecipeController.delete)


module.exports = routes