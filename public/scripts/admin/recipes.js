// Active menu
const currentPage = location.pathname
const menuItems = document.querySelectorAll(".menu a")

for (item of menuItems) {
  if (currentPage.includes(item.getAttribute("href")))
    item.classList.add("active")
}


// Show recipe
const cards = document.querySelectorAll(".card-admin a")

for (let show of cards) {
  show.addEventListener("click", () => {
    let index = show.getAttribute("id")

    window.location.href = `/admin/recipes/${index}`
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


// Confirm deletion 
const formDelete = document.querySelector("#form-delete")

formDelete.addEventListener("submit", (event) => {
  const confirmation = confirm("Do you really want to delete your profile?")
  
  if (!confirmation) {
    event.preventDefault()
  }
})