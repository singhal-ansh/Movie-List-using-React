const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.MOVIE_API_KEY;

if (!API_KEY) {
  console.error("FATAL ERROR: MOVIE_API_KEY is not defined in .env file.");
  process.exit(1);
}

app.get('/api/popular', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const { data } = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular movies.' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) return res.status(400).json({ message: 'A search query is required.' });
    const { data } = await axios.get(`${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for movies.' });
  }
});

app.get('/api/movies/:id/videos', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE_URL}/movie/${req.params.id}/videos?api_key=${API_KEY}&language=en-US`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos.' });
  }
});

app.get('/api/movies/:id/similar', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE_URL}/movie/${req.params.id}/similar?api_key=${API_KEY}&language=en-US`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching similar movies.' });
  }
});

app.get('/api/movies/:id/credits', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE_URL}/movie/${req.params.id}/credits?api_key=${API_KEY}&language=en-US`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching credits.' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE_URL}/movie/${req.params.id}?api_key=${API_KEY}&language=en-US`);
    res.json(data);
  } catch (error) {
    if (error.response?.status === 404) return res.status(404).json({ message: 'Movie not found.' });
    res.status(500).json({ message: 'Error fetching movie details.' });
  }
});



app.get('/api/genres', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching genres.' });
  }
});

app.get('/api/discover', async (req, res) => {
  try {
    const { genre, page = 1 } = req.query;
    const { data } = await axios.get(`${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre}&page=${page}&sort_by=popularity.desc`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies by genre.' });
  }
});

app.listen(PORT, () => console.log(`✅ Server is listening on port ${PORT}`));
