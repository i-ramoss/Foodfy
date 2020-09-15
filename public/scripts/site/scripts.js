// Open each recipe
const cards = document.querySelectorAll(".card img")

for (let recipe of cards) {
  recipe.addEventListener("click", () => {
    let index = recipe.getAttribute("id")

    window.location.href = `/recipes/${index}`
  })
}


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


// Active menu
const currentPage = location.pathname
const menuItems = document.querySelectorAll(".menu a")

for (item of menuItems) {
  if (currentPage.includes(item.getAttribute("href")))
    item.classList.add("active")
}