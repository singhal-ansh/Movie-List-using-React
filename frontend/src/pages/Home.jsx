import MovieCard from "../components/MovieCard";
import { useState, useEffect, useCallback } from "react";
import { searchMovies, getPopularMovies, getGenres, getMoviesByGenre } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [activeSearch, setActiveSearch] = useState("");

  useEffect(() => {
    getGenres().then(setGenres).catch(() => {});
  }, []);

  const loadMovies = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      let result;
      if (activeSearch) {
        result = await searchMovies(activeSearch, pageNum);
      } else if (selectedGenre) {
        result = await getMoviesByGenre(selectedGenre, pageNum);
      } else {
        result = await getPopularMovies(pageNum);
      }
      setMovies(prev => append ? [...prev, ...result.results] : result.results);
      setTotalPages(result.totalPages);
      setError(null);
    } catch {
      setError("Failed to load movies...");
    } finally {
      setLoading(false);
    }
  }, [activeSearch, selectedGenre]);

  useEffect(() => {
    setPage(1);
    loadMovies(1, false);
  }, [activeSearch, selectedGenre, loadMovies]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSelectedGenre(null);
    setActiveSearch(q);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setSelectedGenre(null);
  };

  const handleGenreClick = (genreId) => {
    setSearchQuery("");
    setActiveSearch("");
    setSelectedGenre(prev => prev === genreId ? null : genreId);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMovies(nextPage, true);
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
        {(activeSearch || selectedGenre) && (
          <button type="button" className="clear-button" onClick={handleClearSearch}>✕ Clear</button>
        )}
      </form>

      <div className="genre-filters">
        {genres.map(genre => (
          <button
            key={genre.id}
            className={`genre-pill ${selectedGenre === genre.id ? "active" : ""}`}
            onClick={() => handleGenreClick(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {activeSearch && <p className="results-label">Results for "<strong>{activeSearch}</strong>"</p>}
      {selectedGenre && <p className="results-label">Genre: <strong>{genres.find(g => g.id === selectedGenre)?.name}</strong></p>}

      {error && <div className="error-message">{error}</div>}

      {loading && movies.length === 0 ? (
        <div className="loading">Loading...</div>
      ) : movies.length === 0 ? (
        <div className="no-results">No movies found.</div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard movie={movie} key={`${movie.id}-${movie.title}`} />
            ))}
          </div>
          {page < totalPages && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={handleLoadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
