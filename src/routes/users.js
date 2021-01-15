const express = require("express")

const SessionController = require("../app/controllers/SessionController")
const ProfileController = require("../app/controllers/ProfileController")
const UserController = require("../app/controllers/UserController")

const UserValidator = require("../app/validators/user")
const SessionValidator = require("../app/validators/session")

const { onlyUsers, userIsLogged, userIsAdmin } = require("../app/middlewares/session")

const routes = express.Router()

// login / logout
.get("/login", userIsLogged, SessionController.loginForm)
.post("/login", SessionValidator.login, SessionController.login)
.post("/logout", SessionController.logout)

// reset / forgot password
.get("/forgot-password", SessionController.forgotForm)
.get("/reset-password", SessionController.resetForm)
.post("/forgot-password", SessionValidator.forgot,  SessionController.forgot)
.post("/reset-password", SessionValidator.reset, SessionController.reset)

// Profile
.get("/profile", onlyUsers, UserValidator.profile, ProfileController.index)
.put("/profile", onlyUsers, UserValidator.profileUpdate, ProfileController.update)

// Admin
.get("/users", onlyUsers, UserController.list)
.get("/users/register", userIsAdmin, UserController.registerForm)
.get("/users/:id/edit", userIsAdmin, UserValidator.edit, UserController.edit)
.post("/users", userIsAdmin, UserValidator.create, UserController.create)
.put("/users", userIsAdmin, UserValidator.update, UserController.update)
// .delete("/users", onlyUsers, UserController.delete)


module.exports = routes