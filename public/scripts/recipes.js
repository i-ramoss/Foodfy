const cards = document.querySelectorAll('.card')
const recipes = document.querySelectorAll('.recipe')


for (let card of cards) {
  card.addEventListener('click', () => {
    let index = card.getAttribute('id')

    window.location.href = `/recipes/${index}` 
  })
}

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

