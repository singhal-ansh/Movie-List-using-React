const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = async (response) => {
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
};

export const getPopularMovies = async (page = 1) => {
  const data = await fetch(`${BACKEND_BASE_URL}/api/popular?page=${page}`).then(handleResponse);
  return { results: data.results, totalPages: data.total_pages };
};

export const searchMovies = async (query, page = 1) => {
  const data = await fetch(`${BACKEND_BASE_URL}/api/search?query=${encodeURIComponent(query)}&page=${page}`).then(handleResponse);
  return { results: data.results, totalPages: data.total_pages };
};

export const getMovieDetails = async (id) => {
  return fetch(`${BACKEND_BASE_URL}/api/movies/${id}`).then(handleResponse);
};

export const getMovieVideos = async (id) => {
  return fetch(`${BACKEND_BASE_URL}/api/movies/${id}/videos`).then(handleResponse);
};

export const getSimilarMovies = async (id) => {
  const data = await fetch(`${BACKEND_BASE_URL}/api/movies/${id}/similar`).then(handleResponse);
  return data.results;
};

export const getMovieCredits = async (id) => {
  return fetch(`${BACKEND_BASE_URL}/api/movies/${id}/credits`).then(handleResponse);
};

export const getGenres = async () => {
  const data = await fetch(`${BACKEND_BASE_URL}/api/genres`).then(handleResponse);
  return data.genres;
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  const data = await fetch(`${BACKEND_BASE_URL}/api/discover?genre=${genreId}&page=${page}`).then(handleResponse);
  return { results: data.results, totalPages: data.total_pages };
};
