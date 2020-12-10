// Active menu
const ActiveMenu = {
  active() {
    const currentPage = location.pathname
    const menuItems = document.querySelectorAll(".menu a")

    for (item of menuItems) {
      if (currentPage.includes(item.getAttribute("href")))
        item.classList.add("active")
    }
  }
}

ActiveMenu.active()


// Add input
const AddIngredientAndStepPreparation = {
  addInput(event) {
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
}


// Confirm delete
const confirmDelete = () => {
  button.addEventListener("submit", event => {
    event.preventDefault()
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  })
}

const button = document.querySelector(".delete")
if (button) confirmDelete()


// function confirmDelete(formDelete) {
//   formDelete.addEventListener("submit", (event) => {
//     const confirmation = confirm("Do you really want to delete this?")
    
//     if (!confirmation) {
//       event.preventDefault()
//     }
//   })
// }

// const formDelete = document.querySelector("#form-delete")

// if(formDelete)
//   confirmDelete(formDelete)


// Image Upload
const ImagesUpload = {
  preview: document.querySelector("#images-preview"),

  uploadLimit: "",

  files: [],

  input: "",

  handleFileInput(event, limit) {
    const { files: fileList } = event.target
    const { preview, getContainer, hasLimit, getAllFiles } = ImagesUpload

    ImagesUpload.input = event.target
    ImagesUpload.uploadLimit = limit

    if (hasLimit(event)) return

    Array.from(fileList).forEach( file => {
      const { files } = ImagesUpload

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
    
    ImagesUpload.input.files = getAllFiles()
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = ImagesUpload
    const { files: fileList } = input

    if (fileList.length == 0) {
      Swal.fire({
        icon: "error",
        title:"Oops...",
        text:"The recipe needs at least one image!",
      })

      return true
    }

    if (fileList.length > uploadLimit) {
      Swal.fire({
        icon: "error",
        title:"Oops...",
        text:`Upload a maximum of ${uploadLimit} images!`,
      })

      return true
    }

    let imagesDiv = []

    preview.childNodes.forEach( item => {
      if (item.classList && item.classList.value == "image") imagesDiv.push(item)
    })

    const totalImages = fileList.length + imagesDiv.length

    if (totalImages > uploadLimit) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You have reached the maximum image limit!",
      })

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
    button.innerHTML = "delete"

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