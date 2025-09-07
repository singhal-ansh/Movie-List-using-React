// Import necessary packages
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Create an Express app
const app = express();

// Define the port the server will run on
const PORT = process.env.PORT || 5001;

// === Middleware ===
app.use(cors()); // Enable CORS so your frontend can talk to this backend

// === Server Setup ===
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.MOVIE_API_KEY; // Your key is now securely loaded from .env

// A quick check to make sure the API key is loaded
if (!API_KEY) {
  console.error("FATAL ERROR: MOVIE_API_KEY is not defined in .env file.");
  process.exit(1); // Exit the process with an error code
}


// === Routes ===

/**
 * Route to get popular movies.
 * Your frontend will now call: /api/popular
 */
app.get('/api/popular', async (req, res) => {
  try {
    const apiUrl = `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    console.log(`Proxying request for popular movies to: ${apiUrl}`);
    
    const apiResponse = await axios.get(apiUrl);
    res.json(apiResponse.data);
  } catch (error) {
    console.error('Error fetching popular movies:', error.message);
    res.status(500).json({ message: 'Error fetching popular movies.' });
  }
});


/**
 * Route to search for movies.
 * It expects a 'query' parameter, e.g., /api/search?query=inception
 * Your frontend will now call: /api/search?query=<your-search-term>
 */
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from the request URL
    if (!query) {
      return res.status(400).json({ message: 'A search query is required.' });
    }

    const apiUrl = `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    console.log(`Proxying search request to: ${apiUrl}`);
    
    const apiResponse = await axios.get(apiUrl);
    res.json(apiResponse.data);
  } catch (error) {
    console.error('Error searching for movies:', error.message);
    res.status(500).json({ message: 'Error searching for movies.' });
  }
});

/**
 * Route to get details for a single movie by its ID.
 * It expects an 'id' parameter, e.g., /api/movies/550
 * Your frontend will call this for the movie details page.
 */
app.get('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the movie ID from the URL

    const apiUrl = `${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`;
    console.log(`Proxying request for movie ID ${id} to: ${apiUrl}`);

    const apiResponse = await axios.get(apiUrl);
    res.json(apiResponse.data);
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    // Check if the error is a 404 from TMDb
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    res.status(500).json({ message: 'Error fetching movie details.' });
  }
});

// === Start the server ===
app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});