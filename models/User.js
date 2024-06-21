const mongoose = require('mongoose')

// const { Schema, objectId } = mongoose 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 0
    },
    // image: {
    //     type: String,

    // },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }


}, { timestamps: true })

module.exports = mongoose.model('UserModel', userSchema)