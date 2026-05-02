const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const fetchPopularMovies = async () => {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
        if (!response.ok) {
            throw new Error(`TMDB API Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching from TMDB:', error);
        throw error;
    }
};

module.exports = {
    fetchPopularMovies
};
