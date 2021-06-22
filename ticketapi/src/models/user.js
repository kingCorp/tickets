const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {
        type: String, 
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    password: {type: String, required: true},
    // phone: {type: String, required: true},
    // address: {type: String,},
    avatar: {type: String, default: 'https://www.sackettwaconia.com/wp-content/uploads/default-profile.png'},
    verify: {type: Boolean, default: false},
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);