const Theater = require('../models/Theater');

const getTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find({});
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTheater = async (req, res) => {
    try {
        const theater = new Theater(req.body);
        const createdTheater = await theater.save();
        res.status(201).json(createdTheater);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTheater = async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        if (theater) {
            theater.name = req.body.name || theater.name;
            theater.location = req.body.location || theater.location;
            const updatedTheater = await theater.save();
            res.json(updatedTheater);
        } else {
            res.status(404).json({ message: 'Theater not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTheater = async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        if (theater) {
            await theater.deleteOne();
            res.json({ message: 'Theater removed' });
        } else {
            res.status(404).json({ message: 'Theater not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTheaters, createTheater, updateTheater, deleteTheater };
