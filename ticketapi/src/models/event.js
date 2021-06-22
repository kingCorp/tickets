const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    description: {type: String},
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);