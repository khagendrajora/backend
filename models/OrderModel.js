const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const orderSchema = new mongoose.Schema({
    orderItem: [{
        type: ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress1: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: 'Pending',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'UserModel',
        required: true
    },

    contact: {
        type: Number,
        required: true
    }


}, { timestamps: true })
module.exports = mongoose.model('OrderModel', orderSchema)