const Movie = require('../models/Movie');
const tmdbService = require('../services/tmdbService');

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) res.json(movie);
        else res.status(404).json({ message: 'Movie not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMovie = async (req, res) => {
    try {
        const movie = new Movie(req.body);
        const createdMovie = await movie.save();
        res.status(201).json(createdMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            movie.title = req.body.title || movie.title;
            movie.description = req.body.description || movie.description;
            movie.duration = req.body.duration || movie.duration;
            movie.genre = req.body.genre || movie.genre;
            movie.language = req.body.language || movie.language;
            movie.posterUrl = req.body.posterUrl || movie.posterUrl;
            
            const updatedMovie = await movie.save();
            res.json(updatedMovie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            await movie.deleteOne();
            res.json({ message: 'Movie removed' });
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const syncTMDBMovies = async (req, res) => {
    try {
        const tmdbMovies = await tmdbService.fetchPopularMovies();
        
        const moviesToInsert = tmdbMovies.map(movie => ({
            title: movie.title,
            description: movie.overview,
            duration: 120,
            genre: 'Various',
            language: movie.original_language,
            posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            rating: movie.vote_average,
            votes: movie.vote_count
        }));

        await Movie.deleteMany({});
        const inserted = await Movie.insertMany(moviesToInsert);

        res.json({ message: `Successfully synced ${inserted.length} movies`, movies: inserted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rateMovie = async (req, res) => {
    try {
        const { rating } = req.body;
        if (rating < 1 || rating > 10) {
            return res.status(400).json({ message: 'Rating must be between 1 and 10' });
        }

        const movie = await Movie.findById(req.params.id);
        if (movie) {
            const newTotalVotes = (movie.votes || 0) + 1;
            const currentTotalScore = (movie.rating || 0) * (movie.votes || 0);
            const newAverage = (currentTotalScore + Number(rating)) / newTotalVotes;
            
            movie.rating = Number(newAverage.toFixed(1));
            movie.votes = newTotalVotes;

            const updatedMovie = await movie.save();
            res.json(updatedMovie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, syncTMDBMovies, rateMovie };
