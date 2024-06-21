const multer = require('multer')
//fs is used to read the folder and file
const fs = require('fs')  //inbuild module of nodejs

//path is used to read the filename and extensions
const path = require('path')  //inbuild module of nodejs

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let fileDestination = 'public/uploads/'
        //check if directory exist
        if (!fs.existsSync(fileDestination)) {
            fs.mkdirSync(fileDestination, { recursive: true })
            cb(null, fileDestination)
        } else {
            cb(null, fileDestination)
        }

    },
    filename: function (req, file, cb) {
        let filename = path.basename(file.originalname, path.extname(file.originalname))
        let ext = path.extname(file.originalname)

        cb(null, filename + '_' + Date.now() + ext)

    }
})

const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|png|jpeg|webp|gif|JPG|PNG|JPEG)$/)) {
        return cb(new Error('Only Image file are supported'), false)
    } else {
        cb(null, true)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    // limits: {
    //     fileSize: 2000000    //2mb
    // }
})
module.exports = upload

//follow the documentation of multer. 