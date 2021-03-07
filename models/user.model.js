const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, unique:true, required:true},
    emailVerification: {type: Boolean, default: false},
    password: {type:String, required:true},
    imgURL: {type: String},
    updated_at: {type: Date, default: Date.now}
})


module.exports = mongoose.model('user', userSchema)