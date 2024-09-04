// MovieDetailsFetcher.jsx
import { useEffect } from "react";
import axios from "axios";

function MovieDetailsFetcher({ movieName, onMovieDetailsFetched }) {
    useEffect(() => {
        const API_KEY = "d61ae016cfddbd20b6e8194e558cc4d8";

        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}&language=en-US`);
                
                // Check if any movie found with the given name
                if (response.data.results.length > 0) {
                    const movieId = response.data.results[0].id; // Get the ID of the first movie in the search results
                    const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
                    onMovieDetailsFetched(movieResponse.data);
                } else {
                    console.error("Movie not found.");
                    onMovieDetailsFetched(null);
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
                onMovieDetailsFetched(null);
            }
        };

        fetchMovieDetails();

    }, [movieName, onMovieDetailsFetched]);

    return // Return loading message while fetching
}

export default MovieDetailsFetcher;
