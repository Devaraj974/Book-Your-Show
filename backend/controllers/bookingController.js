const Booking = require('../models/Booking');
const Show = require('../models/Show');
const { sendTicketEmail } = require('../utils/emailService');

const createBooking = async (req, res) => {
    const { showId, seats, totalAmount, paymentStatus } = req.body;

    if (!seats || seats.length === 0) {
        return res.status(400).json({ message: 'No seats selected. Please go back and pick your seats.' });
    }

    try {
        const show = await Show.findById(showId).populate('movieId theaterId');
        if (!show) {
            console.error('Booking failed: Show not found for id', showId);
            return res.status(404).json({ message: 'Show not found' });
        }

        console.log('--- New Booking Request ---');
        console.log('User:', req.user._id);
        console.log('Show ID:', showId);
        console.log('Seats:', seats);
        console.log('Total Amount:', totalAmount);

        // Check if seats are still available
        const areAvailable = seats.every(seat => show.availableSeats.includes(seat));
        if (!areAvailable) {
            const unavailable = seats.filter(seat => !show.availableSeats.includes(seat));
            console.warn('Booking failed: Seats already taken:', unavailable);
            return res.status(400).json({ message: `Seats ${unavailable.join(', ')} are no longer available.` });
        }

        // Lock/Remove seats from available
        show.availableSeats = show.availableSeats.filter(seat => !seats.includes(seat));
        await show.save();
        console.log('Show updated: availableSeats length:', show.availableSeats.length);

        const booking = new Booking({
            userId: req.user._id,
            showId,
            seats,
            totalAmount,
            paymentStatus: paymentStatus || 'Confirmed'
        });

        const createdBooking = await booking.save();
        console.log('Booking created successfully:', createdBooking._id);

        // Send confirmation email asynchronously
        try {
            await sendTicketEmail({
                user: req.user,
                movie: show.movieId,
                theater: show.theaterId,
                show: show,
                seats,
                totalAmount,
                bookingId: createdBooking._id
            });
        } catch (emailError) {
            console.error('Non-critical error: Failed to send booking email:', emailError.message);
            // We don't return error to user because the booking itself was successful
        }

        res.status(201).json(createdBooking);
    } catch (error) {
        console.error('CRITICAL Booking Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate({
            path: 'showId',
            populate: { path: 'movieId theaterId' }
        });
        res.json(bookings);
    } catch (error) {
        console.error('Get My Bookings Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('userId', 'id name email').populate({
            path: 'showId',
            populate: { path: 'movieId theaterId' }
        });
        res.json(bookings);
    } catch (error) {
        console.error('Get All Bookings Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId', 'name email')
            .populate({
                path: 'showId',
                populate: { path: 'movieId theaterId' }
            });
        if (booking) res.json(booking);
        else res.status(404).json({ message: 'Booking not found' });
    } catch (error) {
        console.error('Get Booking By ID Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings, getBookingById };
