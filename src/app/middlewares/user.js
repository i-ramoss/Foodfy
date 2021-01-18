function chefPermission(request, response, next) {
  if (!request.session.isAdmin) return response.redirect("/admin/chefs")

  next()
}

module.exports = {
  chefPermission
}