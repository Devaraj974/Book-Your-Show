const mongoose = require('mongoose');

const theaterSchema = mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Theater', theaterSchema);
