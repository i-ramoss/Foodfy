function chefPermission(request, response, next) {
  if (!request.session.isAdmin) return response.redirect("/admin/chefs")

  next()
}

function recipePermission(request, response, next) {
  if (!request.session.isAdmin) return response.redirect("/admin/recipes")

  next()
}

module.exports = {
  chefPermission,
  recipePermission
}