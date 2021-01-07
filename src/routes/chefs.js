const express = require("express")
const multer = require("../app/middlewares/multer")

const ChefController = require("../app/controllers/ChefController");

const routes = express.Router()

.get("/", ChefController.index)
.get("/create", ChefController.create)
.get("/:id", ChefController.show)
.get("/:id/edit", ChefController.edit)

.post("/", multer.array("images", 1), ChefController.post)
.put("/", multer.array("images", 1), ChefController.update)
.delete("/", ChefController.delete)


module.exports = routes