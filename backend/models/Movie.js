const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    genre: { type: String, required: true },
    language: { type: String, required: true },
    posterUrl: { type: String, required: true },
    rating: { type: Number, default: 0 },
    votes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
