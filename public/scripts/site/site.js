// Open each recipe
const cards = document.querySelectorAll(".card img")

for (let recipe of cards) {
  recipe.addEventListener("click", () => {
    let index = recipe.getAttribute("id")

    window.location.href = `/recipes/${index}`
  })
}

// Open each chef
const chef_cards = document.querySelectorAll(".card-admin.chefs img")

for (let chef of chef_cards) {
  chef.addEventListener("click", () => {
    let index = chef.getAttribute("id")

    window.location.href = `/chefs/${index}`
  })
}

// Hide recipe content
const infos = document.querySelectorAll('.toggle-content')

for (let info of infos) {
  const hide = info.querySelector('.hide')
  const data = info.querySelector('.data')

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