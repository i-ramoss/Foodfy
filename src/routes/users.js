const express = require("express")

const SessionController = require("../app/controllers/SessionController")
const ProfileController = require("../app/controllers/ProfileController")
const UserController = require("../app/controllers/UserController")

const UserValidator = require("../app/validators/user")
const SessionValidator = require("../app/validators/session")

const routes = express.Router()

// login / logout
.get("/login", SessionController.loginForm)
.post("/login", SessionValidator.login, SessionController.login)
.post("/logout", SessionController.logout)

// reset / forgot password
.get("/forgot-password", SessionController.forgotForm)
.get("/reset-password", SessionController.resetForm)
.post("/forgot-password", SessionValidator.forgot,  SessionController.forgot)
.post("/reset-password", SessionValidator.reset, SessionController.reset)

// Profile
// .get("/profile", ProfileController.index)
// .put("/profile", ProfileController.update)

// Admin
.get("/users", UserController.list)
.get("/users/register", UserController.registerForm)
.get("/users/:id/edit", UserValidator.edit, UserController.edit)
.post("/users", UserValidator.create, UserController.create)
.put("/users", UserValidator.update, UserController.update)
// .delete("/users", UserController.delete)


module.exports = routes