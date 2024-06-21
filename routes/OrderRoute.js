const express = require('express')
const { postOrder, orderList, orderDetail, updateStatus, userOrderList, deleteOrder } = require('../controllers/OrderController')
const { requireUser, requireAdmin } = require('../controllers/UserController')

const router = express.Router()
router.post('/postorder', postOrder)
router.get('/orderlist', orderList)
router.get('/orderdetail/:id', orderDetail)
router.put('/updatestatus/:id', updateStatus)
router.get('/userorderlist/:userid', userOrderList)
router.delete('/deleteorder/:id', deleteOrder)


module.exports = router