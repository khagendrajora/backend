const express = require('express')
const router = express.Router()
const { createUser, login, userDetail, postEmailConfirmation, deleteUser, forgetPwd, resetPwd, signOut, userList, userEdit } = require('../controllers/UserController')   // while importinfg function use {}
const { userValidation, validation, emailValidation, passwordValidation } = require('../validation/Validation')

//const upload = require('../middleware/fileUpload')

//router.post('/createUser', upload.single('image'), userValidation, validation, createUser)
router.post('/createUser', userValidation, createUser)
router.put('/confirmation/:token', postEmailConfirmation)    //req.param. paxi j xa tei lekhna parxa "token"
router.post('/login', login)
router.get('/userdetails/:id', userDetail)
router.post('/forgetpwd', emailValidation, validation, forgetPwd)
router.put('/resetpassword/:token', passwordValidation, validation, resetPwd)
router.post('/signout', signOut)
router.get('/userlist', userList)
router.put('/updateuser/:id', userEdit)
router.delete('/deleteuser/:id', deleteUser)

module.exports = router