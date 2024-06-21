require('dotenv').config()
const express = require('express')
const app = express()
require('./db/connection')
const cors = require('cors');
app.use(cors());   //used when FE and BE are running on different ports and are used to connect them

const bodyParser = require('body-parser')

const port = process.env.PORT || 5000

//At first import from RoutePAge then use in middleware
const createUser = require('./routes/UserRoute')
const item = require('./routes/ItemRoute')
const orderRoute = require('./routes/OrderRoute')
const paymentRoute = require('./routes/PaymentRoute')



//middleware routes
app.use(bodyParser.json())
app.use('/public/uploads', express.static('public/uploads'))
app.use('/api', createUser)
app.use('/api', item)
app.use('/api', orderRoute)
app.use('/api', paymentRoute)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})