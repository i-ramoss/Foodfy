const Chef = require("../models/Chef")

module.exports = {
  index(request, response) {
    Chef.all( chefs => {
      return response.render("admin/chefs/index", { chefs })
    })
  }
}