// Open each recipe
const cards = document.querySelectorAll(".card img")

for (let recipe of cards) {
  recipe.addEventListener("click", () => {
    let index = recipe.getAttribute("id")

    window.location.href = `/recipes/${index}`
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

// Pagination
function paginate(selectedPage, totalPages) {
  let pages = [], oldPage

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

    const firstAndLastPAge = currentPage == 1 || currentPage == 2 || currentPage == totalPages - 1 || currentPage == totalPages
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 1
    const pagesAfterSelectedPage = currentPage <= selectedPage + 1

    if (firstAndLastPAge || pagesBeforeSelectedPage && pagesAfterSelectedPage) {

      if (oldPage && currentPage - oldPage > 2)
        pages.push("...")

      if (oldPage && currentPage - oldPage == 2)
        pages.push(oldPage + 1)

      pages.push(currentPage)
      oldPage = currentPage
    }
  }

  return pages
}

function createPagination(pagination) {
  const filter = pagination.dataset.filter
  const page = +pagination.dataset.page
  const total = +pagination.dataset.total
  const pages = paginate(page, total)

  let elements = ""

  for (let page of pages) {
    if(String(page).includes("...")) {
      elements += `<span>${page}</span>`
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
      } else {
        elements += `<a href="?page=${page}">${page}</a>`
      }
    }
  }

  pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) 
  createPagination(pagination)