import MovieCard from "../components/MovieCard";
import { useState, useEffect, useCallback, useRef } from "react";
import { searchMovies, getPopularMovies, getGenres, getMoviesByGenre } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

const TMDB_IMG = "https://image.tmdb.org/t/p/w92";

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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const debounceRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getGenres().then(setGenres).catch(() => {});
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced suggestions fetch
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await searchMovies(searchQuery.trim(), 1);
        setSuggestions(result.results.slice(0, 6));
        setShowSuggestions(true);
        setActiveSuggestion(-1);
      } catch {
        setSuggestions([]);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

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

  const commitSearch = (q) => {
    if (!q.trim()) return;
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedGenre(null);
    setActiveSearch(q.trim());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    commitSearch(searchQuery);
  };

  const handleSuggestionClick = (movie) => {
    setShowSuggestions(false);
    navigate(`/movie/${movie.id}`);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setSelectedGenre(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleGenreClick = (genreId) => {
    setSearchQuery("");
    setActiveSearch("");
    setSelectedGenre(prev => prev === genreId ? null : genreId);
    setShowSuggestions(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMovies(nextPage, true);
  };

  return (
    <div className="home">
      <div className="search-wrapper" ref={searchWrapperRef}>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for movies..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            autoComplete="off"
          />
          <button type="submit" className="search-button">Search</button>
          {(activeSearch || selectedGenre) && (
            <button type="button" className="clear-button" onClick={handleClearSearch}>✕ Clear</button>
          )}
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {suggestions.map((movie, i) => (
              <li
                key={movie.id}
                className={`suggestion-item ${i === activeSuggestion ? "active" : ""}`}
                onMouseDown={() => handleSuggestionClick(movie)}
                onMouseEnter={() => setActiveSuggestion(i)}
              >
                <img
                  src={movie.poster_path ? `${TMDB_IMG}${movie.poster_path}` : "https://via.placeholder.com/40x60?text=N%2FA"}
                  alt={movie.title}
                  className="suggestion-poster"
                />
                <div className="suggestion-info">
                  <span className="suggestion-title">{movie.title}</span>
                  <span className="suggestion-year">{movie.release_date?.split("-")[0]}</span>
                </div>
                {movie.vote_average > 0 && (
                  <span className="suggestion-rating">⭐ {movie.vote_average.toFixed(1)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

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
