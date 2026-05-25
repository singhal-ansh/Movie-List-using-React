import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { Link } from "react-router-dom";

const PLACEHOLDER = "https://via.placeholder.com/500x750?text=No+Image";

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites, isInWatchlist, addToWatchlist, removeFromWatchlist } = useMovieContext();
  const favorite = isFavorite(movie.id);
  const inWatchlist = isInWatchlist(movie.id);

  function onFavoriteClick(e) {
    e.preventDefault();
    favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
  }

  function onWatchlistClick(e) {
    e.preventDefault();
    inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
  }

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <div className="movie-poster">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : PLACEHOLDER}
            alt={movie.title}
            onError={(e) => { e.target.src = PLACEHOLDER; }}
          />
          <div className="movie-overlay">
            <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick} title={favorite ? "Remove from favorites" : "Add to favorites"}>
              ♥
            </button>
            <button className={`watchlist-btn ${inWatchlist ? "active" : ""}`} onClick={onWatchlistClick} title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}>
              {inWatchlist ? "✓" : "+"}
            </button>
          </div>
        </div>
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>{movie.release_date?.split("-")[0]}</p>
          {movie.vote_average > 0 && (
            <p className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
