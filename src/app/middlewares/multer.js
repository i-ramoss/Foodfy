const multer = require("multer")

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "./public/images")
  },

  filename: (request, file, cb) => {
    cb(null,` ${Date.now().toString()}-${file.originalname}`)
  }
})

const fileFilter = (request, file, cb) => {
  const isAccepted = ["image/png", "image/jpg", "image/jpeg"]
  .find(acceptedFormat => acceptedFormat == file.mimetype)

  if(isAccepted) return cb(null, true)

  return cb(null, false)
}

module.exports = multer({
  storage,
  fileFilter,
})