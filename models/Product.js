const mongoose = require('mongoose')


const itemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true
    },
    item_category: {
        type: String,
        required: true
    },
    item_description: {
        type: String,
        required: true

    },
    item_image: {
        type: String,
        required: true

    },
    item_price: {
        type: Number,
        required: true
    },

})
module.exports = mongoose.model('ItemSchema', itemSchema)