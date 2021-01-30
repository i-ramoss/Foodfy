const express = require("express")
const multer = require("../app/middlewares/multer")

const RecipeValidator = require("../app/validators/recipe")

const RecipeController = require("../app/controllers/RecipeController")

const routes = express.Router()

.get("/", RecipeValidator.index, RecipeController.index)
.get("/create", RecipeController.create)
.get("/:id", RecipeValidator.permission, RecipeValidator.show, RecipeController.show)
.get("/:id/edit", RecipeValidator.permission, RecipeValidator.show, RecipeController.edit)

.post("/", multer.array("images", 5), RecipeValidator.create, RecipeController.post)
.put ("/", multer.array("images", 5), RecipeValidator.update, RecipeController.update)
.delete("/", RecipeController.delete)


module.exports = routes