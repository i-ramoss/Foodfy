const express = require("express")

const SessionController = require("../app/controllers/SessionController")
const ProfileController = require("../app/controllers/ProfileController")
const UserController = require("../app/controllers/UserController")

const UserValidator = require("../app/validators/user")

const routes = express.Router()

// // login / logout
// .get("/login". SessionController.loginForm)
// .post("/login". SessionController.login)
// .post("/logout". SessionController.logout)

// // reset / forgot password
// .get("/forgot-password". SessionController.forgotForm)
// .get("/password-reset". SessionController.resetForm)
// .post("/forgot-password". SessionController.forgot)
// .post("/password-reset". SessionController.reset)

// // Profile
// .get("/profile", ProfileController.index)
// .put("/profile", ProfileController.update)

// // Admin
// .get("/users", UserController.list)
.get("/users/register", UserController.registerForm)
.post("/users/register", UserValidator.create, UserController.create)
// .put("/users", UserController.update)
// .delete("/users", UserController.delete)


module.exports = routes