const mongoose = require('mongoose');

const showSchema = mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    showTime: { type: Date, required: true },
    availableSeats: [{ type: String }],
    totalSeats: { type: Number, required: true, default: 60 },
    price: { type: Number, required: true, default: 150 }
}, { timestamps: true });

module.exports = mongoose.model('Show', showSchema);
