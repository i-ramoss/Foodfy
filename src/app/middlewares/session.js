function onlyUsers(request, response, next) {
  if (!request.session.userId) return response.redirect("/admin/login")

  next()
}

function userIsLogged(request, response, next) {
  if (request.session.userId) return response.redirect("/admin/profile")

  next()
}

function userIsAdmin(request, response, next) {
  if (!request.session.isAdmin) return response.redirect("/admin/profile")

  next()
}

module.exports = {
  onlyUsers,
  userIsLogged,
  userIsAdmin
}