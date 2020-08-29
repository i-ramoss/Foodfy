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
    if (hide.innerHTML == 'HIDE')
      hide.innerHTML = 'SHOW'
    else
      hide.innerHTML = 'HIDE'
    
    data.classList.toggle('active')
  })
}

// Add input
function addInput(event) {
  const buttonName = event.target.name
  const ingredients = document.querySelector("#ingredients")
  const steps = document.querySelector("#steps")
  const fieldContainer = document.querySelectorAll(`.${buttonName}`)

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

  if (newField.children[0].value == "")
    return false
  
  newField.children[0].value = ""
  if (buttonName == "ingredient")
    ingredients.appendChild(newField)
  else  
    steps.appendChild(newField)
}

document
  .querySelectorAll(".add-input")
  .forEach(button => button.addEventListener("click", addInput))