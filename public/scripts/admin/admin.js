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
const RecipeImagesUpload = {
  preview: document.querySelector("#images-preview"),

  uploadLimit: 5,

  files: [],

  input: "",

  handleFileInput(event) {
    const { files: fileList } = event.target
    const { preview, getContainer, hasLimit, getAllFiles } = RecipeImagesUpload

    RecipeImagesUpload.input = event.target

    if (hasLimit(event)) return

    Array.from(fileList).forEach( file => {
      const { files } = RecipeImagesUpload

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
    
    RecipeImagesUpload.input.files = getAllFiles()
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = RecipeImagesUpload
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

    let imagesDiv = []
    
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
    const { files } = RecipeImagesUpload

    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
   
    files.forEach( file => dataTransfer.items.add(file))

    return dataTransfer.files
  },

  getContainer(image) {
    const { getRemoveButton, removeImage } = RecipeImagesUpload
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
    button.innerHTML = "delete"

    return button
  },

  removeImage(event) {
    const { preview, files, input, getAllFiles } = RecipeImagesUpload

    const imageDiv = event.target.parentNode // div class="image">
    const imagesArray = Array.from(preview.children)
    const index = imagesArray.indexOf(imageDiv)

    files.splice(index, 1)
    input.files = getAllFiles()

    imageDiv.remove()
  },

  removeOldImage(event) {
    const imageDiv = event.target.parentNode

    if (imageDiv.id) {
      const removedFiles = document.querySelector("input[name='removed_files']")

      if (removedFiles) removedFiles.value += `${imageDiv.id},`
    }

    imageDiv.remove()
  }
}


// Gallery
const ImageGallery = {
  highlight: document.querySelector(".gallery .highlight > img"),

  previews: document.querySelectorAll(".gallery-preview img"),

  setImage(e) {
    const { target } = e
    const { previews, highlight } = ImageGallery
    const { image } = LightBox
    
    previews.forEach( preview => preview.classList.remove("active"))

    target.classList.add("active")

    highlight.src = target.src

    image.src = target.src
  }
}

// LightBox
const LightBox = {
  target: document.querySelector(".lightbox-target"),

  image: document.querySelector(".lightbox-target img"),

  closeButton: document.querySelector(".lightbox-target a.lightbox-close"),

  open() {
    const { target, closeButton } = LightBox

    target.style.opacity = 1
    target.style.top = 0
    target.style.bottom = 0

    closeButton.style.top = 0
  },

  close() {
    const { target, closeButton } = LightBox

    target.style.opacity = 0
    target.style.top = "-100%"
    target.style.bottom = "initial"

    closeButton.style.top = "-80px"
  },
}