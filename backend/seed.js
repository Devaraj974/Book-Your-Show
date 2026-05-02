const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Models
const User = require('./models/User');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Show = require('./models/Show');
const Booking = require('./models/Booking');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const movies = [
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        duration: 148,
        genre: "Sci-Fi, Action",
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2000&auto=format&fit=crop"
    },
    {
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        duration: 152,
        genre: "Action, Crime, Drama",
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2000&auto=format&fit=crop"
    },
    {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        duration: 169,
        genre: "Adventure, Drama, Sci-Fi",
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2000&auto=format&fit=crop"
    },
    {
        title: "Christopher Nolan's The Odyssey",
        description: "An epic space odyssey from the mind of Christopher Nolan, exploring the furthest reaches of the galaxy and the human soul.",
        duration: 185,
        genre: "Sci-Fi, Adventure, IMAX",
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2000&auto=format&fit=crop"
    },
    {
        title: "Marvel's Avengers: Doomsday",
        description: "The Avengers face their ultimate challenge as Doctor Doom emerges to reshape reality itself.",
        duration: 162,
        genre: "Action, Sci-Fi",
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Dune Part 3",
        description: "The conclusion of the epic desert trilogy, where Paul Atreides' prophecy leads to a final confrontation.",
        duration: 178,
        genre: "Sci-Fi, Drama",
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2000&auto=format&fit=crop"
    },
    {
        title: "Spider-Man: Brand New Day",
        description: "A fresh start for the web-slinger as he balances a new life with an emerging threat in New York.",
        duration: 145,
        genre: "Action, Adventure",
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1974&auto=format&fit=crop"
    },
    {
        title: "Project Hail Mary",
        description: "Alone on a spacecraft, an astronaut must use his scientific knowledge to save humanity with a mysterious ally.",
        duration: 155,
        genre: "Sci-Fi, Thriller",
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=2000&auto=format&fit=crop"
    },
    {
        title: "Oppenheimer",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        duration: 180,
        genre: "Biography, Drama, History",
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop"
    },
    {
        title: "Ramayana Part 1",
        description: "The epic journey of Lord Rama begins in this grand mythological retelling of the ancient Indian saga.",
        duration: 165,
        genre: "Mythological, Action, Drama",
        language: "Hindi",
        posterUrl: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=1974&auto=format&fit=crop"
    },
    {
        title: "Dhurandhar: The Revenge",
        description: "A gritty action thriller about a lone warrior seeking justice in a world of betrayal.",
        duration: 138,
        genre: "Action, Thriller",
        language: "Marathi/Hindi",
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2050&auto=format&fit=crop"
    }
];

const theaters = [
    { name: "PVR Cinemas: Forum Mall", location: "Koramangala, Bangalore" },
    { name: "INOX: Mantri Square", location: "Malleswaram, Bangalore" },
    { name: "Cinepolis: Orion Mall", location: "Rajajinagar, Bangalore" }
];

const importData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Movie.deleteMany();
        await Theater.deleteMany();
        await Show.deleteMany();
        await Booking.deleteMany();

        // Create Admin User
        await User.create({
            name: "Admin User",
            email: "admin@test.com",
            password: 'admin123',
            role: "admin"
        });

        await User.create({
            name: "Test User",
            email: "user@test.com",
            password: 'user123',
            role: "user"
        });

        const createdMovies = await Movie.insertMany(movies);
        const createdTheaters = await Theater.insertMany(theaters);

        // Create Shows
        const rows = ['N', 'M', 'L', 'K', 'J', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
        const cols = Array.from({ length: 14 }, (_, i) => i + 1);
        const availableSeats = rows.flatMap(row => cols.map(col => `${row}${col}`));
        const totalSeats = availableSeats.length;

        const shows = [];

        for (let movie of createdMovies) {
            for (let theater of createdTheaters) {
                shows.push({
                    movieId: movie._id,
                    theaterId: theater._id,
                    showTime: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
                    availableSeats,
                    totalSeats,
                    price: 200
                });
                shows.push({
                    movieId: movie._id,
                    theaterId: theater._id,
                    showTime: new Date(new Date().setDate(new Date().getDate() + 2)), // Day after tomorrow
                    availableSeats,
                    totalSeats,
                    price: 200
                });
            }
        }

        await Show.insertMany(shows);

        console.log('Data Imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
