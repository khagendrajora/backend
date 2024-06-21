const express = require('express')
const { payment, directPayment } = require('../controllers/paymentController')

const router = express.Router()



router.post('/create-checkout-secession', payment)
router.post('/create-checkout-secessions', directPayment)


module.exports = router
