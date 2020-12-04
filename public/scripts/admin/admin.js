// Active menu
const currentPage = location.pathname
const menuItems = document.querySelectorAll(".menu a")

for (item of menuItems) {
  if (currentPage.includes(item.getAttribute("href")))
    item.classList.add("active")
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
function confirmDelete(formDelete) {
  formDelete.addEventListener("submit", (event) => {
    const confirmation = confirm("Do you really want to delete this?")
    
    if (!confirmation) {
      event.preventDefault()
    }
  })
}

const formDelete = document.querySelector("#form-delete")

if(formDelete)
  confirmDelete(formDelete)


// Image Upload
const ImagesUpload = {
  preview: document.querySelector("#images-preview"),

  uploadLimit: 5,

  files: [],

  input: "",

  handleFileInput(event) {
    const { files: fileList } = event.target
    const { preview, getContainer, hasLimit, files, getAllFiles } = ImagesUpload

    ImagesUpload.input = event.target

    if (hasLimit(event)) return

    Array.from(fileList).forEach( file => {
      files.push(file)

      const reader = new FileReader()

      reader.onload = () => {
        const image = new Image()

        image.src = String(reader.result)

        const div = getContainer(image)

        preview.appendChild(div)
      }

      reader.readAsDataURL(file)
    })
    
    ImagesUpload.input.files =  getAllFiles()
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = ImagesUpload
    const { files: fileList } = input

    if (fileList.length == 0) {
      alert("The recipe needs at least one image!")

      event.preventDefault()

      return true
    }

    if (fileList.length > uploadLimit) {
      alert(`Upload a maximum of ${uploadLimit} images!`)

      event.preventDefault()

      return true
    }

    const imagesDiv = []
    
    preview.childNodes.forEach( item => {
      if (item.classList && item.classList.value == "image") imagesDiv.push(item)
    })

    const totalImages = fileList.length + imagesDiv.length

    if (totalImages > uploadLimit) {
      alert("You have reached the maximum image limit!")

      event.preventDefault()

      return true
    }

    return false
  },

  getAllFiles() {
    const { files } = ImagesUpload

    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
   
    files.forEach( file => dataTransfer.items.add(file))

    return dataTransfer.files
  },

  getContainer(image) {
    const { getRemoveButton, removeImage } = ImagesUpload
    const div = document.createElement("div")

    div.classList.add("image")
    
    div.onclick = removeImage

    div.appendChild(image)
    div.appendChild(getRemoveButton())

    return div
  },

  getRemoveButton() {
    const button = document.createElement("i")

    button.classList.add("material-icons")
    button.innerHTML = "close"

    return button
  },

  removeImage(event) {
    const { preview, files, input, getAllFiles } = ImagesUpload

    const imageDiv = event.target.parentNode // div class="image">
    const imagesArray = Array.from(preview.children)
    const index = imagesArray.indexOf(imageDiv)

    files.splice(index, 1)
    input.files = getAllFiles()

    imageDiv.remove()
  }
}