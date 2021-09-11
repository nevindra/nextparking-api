const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
    },
    type: {
        type: String,
    }
})

const Profile = mongoose.model('profile', profileSchema)

module.exports = Profile