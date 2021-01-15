function onlyUsers(request, response, next) {
  if (!request.session.userId) return response.redirect("/admin/login")

  next()
}

function userIsLogged(request, response, next) {
  if (request.session.userId) return response.redirect("/admin/users")

  next()
}

function userIsAdmin(request, response, next) {
  if (!request.session.isAdmin && request.session.userId) return response.redirect("/admin/users")

  next()
}

module.exports = {
  onlyUsers,
  userIsLogged,
  userIsAdmin
}