// Open each recipe
const recipe_admin = document.querySelectorAll('.card-admin')
const recipe = document.querySelectorAll('.card')

function open(collection) {
  for (let item of collection) {
    item.addEventListener('click', () => {
      let index = item.getAttribute('id')
      if (collection == recipe_admin)
        window.location.href = `/admin/recipes/${index}`
      else
        window.location.href = `/recipes/${index}`
    })
  }
}

open(recipe_admin)
open(recipe)

// Hide recipe content
const recipes = document.querySelectorAll('.recipe')

for (let recipe of recipes) {
  const hide = recipe.querySelector('.hide')
  const data = recipe.querySelector('.data')

  hide.addEventListener('click', () => {
    if (hide.innerHTML == 'ESCONDER')
      hide.innerHTML = 'MOSTRAR'
    else
      hide.innerHTML = 'ESCONDER'
    
    data.classList.toggle('active')
  })
}


