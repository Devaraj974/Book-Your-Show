const Show = require('../models/Show');

const getShowsByMovie = async (req, res) => {
    try {
        const shows = await Show.find({ movieId: req.params.movieId }).populate('theaterId');
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getShowById = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id).populate('movieId theaterId');
        if (show) res.json(show);
        else res.status(404).json({ message: 'Show not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createShow = async (req, res) => {
    try {
        // Init availableSeats with all seats 1 to totalSeats
        const totalSeats = req.body.totalSeats || 60;
        const availableSeats = Array.from({length: totalSeats}, (_, i) => `${i + 1}`);
        
        const show = new Show({
            ...req.body,
            availableSeats
        });
        const createdShow = await show.save();
        res.status(201).json(createdShow);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getShows = async (req, res) => {
    try {
        const shows = await Show.find({}).populate('movieId theaterId');
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateShow = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id);
        if (show) {
            show.movieId = req.body.movieId || show.movieId;
            show.theaterId = req.body.theaterId || show.theaterId;
            show.showTime = req.body.showTime || show.showTime;
            show.price = req.body.price || show.price;
            show.totalSeats = req.body.totalSeats || show.totalSeats;
            
            const updatedShow = await show.save();
            res.json(updatedShow);
        } else {
            res.status(404).json({ message: 'Show not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteShow = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id);
        if (show) {
            await show.deleteOne();
            res.json({ message: 'Show removed' });
        } else {
            res.status(404).json({ message: 'Show not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getShowsByMovie, getShowById, createShow, getShows, updateShow, deleteShow };
