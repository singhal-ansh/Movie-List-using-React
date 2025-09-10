const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getPopularMovies = async () => {
  const response = await fetch(`${BACKEND_BASE_URL}/api/popular`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/search?query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (id) => {
  const response = await fetch(`${BACKEND_BASE_URL}/api/movies/${id}`);
  const data = await response.json();
  return data;
};
