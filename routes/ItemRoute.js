const express = require('express')
const router = express.Router()
const { ItemUpload, itemDetails, itemList, deleteItem, updateItem } = require('../controllers/ItemController')
const { validation } = require('../validation/Validation')
const { requireAdmin } = require('../controllers/UserController')
const upload = require('../middleware/fileUpload')

router.post('/itemupload', upload.single('item_image'), ItemUpload)
router.post('/itemupload', ItemUpload, validation)
router.get('/itemdetails/:id', itemDetails)
router.get('/itemlist', itemList)
router.delete('/deleteitem/:id', deleteItem)
router.put('/itemupdate/:id', upload.single('item_image'), updateItem)

module.exports = router