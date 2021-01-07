const express = require("express")

const SessionController = require("../app/controllers/SessionController")
const ProfileController = require("../app/controllers/ProfileController")
const UserController = require("../app/controllers/UserController")

const routes = express.Router()

/*
// login / logout
.get("/login". SessionController.loginForm)
.post("/login". SessionController.login)
.post("/logout". SessionController.logout)

// reset / forgot password
.get("/forgot-password". SessionController.forgotForm)
.post("/forgot-password". SessionController.forgot)
.get("/password-reset". SessionController.resetForm)
.post("/password-reset". SessionController.reset)

// Profile
.get("/profile", ProfileController.index)
.put("/profile", ProfileController.update)

// Admin
.get("/users", UserController.list)
.post("/users", UserController.create)
.put("/users", UserController.update)
.delete("/users", UserController.delete)
*/


module.exports = routes