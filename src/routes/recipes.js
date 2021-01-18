const express = require("express")
const multer = require("../app/middlewares/multer")

const RecipeValidator = require("../app/validators/recipe")

const RecipeController = require("../app/controllers/RecipeController")

const routes = express.Router()

.get("/", RecipeController.index)
.get("/create", RecipeController.create)
.get("/:id", RecipeController.show)
.get("/:id/edit", RecipeController.edit)

.post("/", multer.array("images", 5), RecipeController.post)
.put ("/", multer.array("images", 5), RecipeController.update)
.delete("/", RecipeController.delete)


module.exports = routes