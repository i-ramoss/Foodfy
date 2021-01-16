const express = require("express")
const multer = require("../app/middlewares/multer")

const { chefPermission } = require("../app/middlewares/user")

const ChefController = require("../app/controllers/ChefController");

const routes = express.Router()

.get("/", ChefController.index)
.get("/create", chefPermission, ChefController.create)
.get("/:id", ChefController.show)
.get("/:id/edit", chefPermission, ChefController.edit)

.post("/", chefPermission, multer.array("images", 1), ChefController.post)
.put("/", chefPermission, multer.array("images", 1), ChefController.update)
.delete("/", chefPermission, ChefController.delete)


module.exports = routes