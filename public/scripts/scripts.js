const modalOverlay = document.querySelector('.modal-overlay')
const cards = document.querySelectorAll('.card')
const modal = document.querySelector('.modal')

for (let card of cards) {
  card.addEventListener('click', () => {
    const recipeImage = card.querySelector('.card img').src
    const recipeName = card.querySelector('.card .name').innerHTML
    const recipeCooker = card.querySelector('.card .cooker').innerHTML

    modalOverlay.classList.add('active')
    modalOverlay.querySelector('img').src = recipeImage
    modalOverlay.querySelector('p.name').innerHTML = recipeName
    modalOverlay.querySelector('p.cooker').innerHTML = recipeCooker
  })
}

document.querySelector('.close-modal').addEventListener('click', () => {
  modalOverlay.classList.remove('active')
  modalOverlay.querySelector('img').src = ""
  modalOverlay.querySelector('p.name').innerHTML = ""
  modalOverlay.querySelector('p.cooker').innerHTML = ""
})