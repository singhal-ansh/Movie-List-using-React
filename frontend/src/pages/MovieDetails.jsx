import "../css/MovieDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails, getMovieVideos, getSimilarMovies, getMovieCredits } from "../services/api";
import MovieCard from "../components/MovieCard";
import { useMovieContext } from "../contexts/MovieContext";

const PLACEHOLDER_PERSON = "https://via.placeholder.com/150x225?text=N%2FA";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites, isInWatchlist, addToWatchlist, removeFromWatchlist } = useMovieContext();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchAll() {
      try {
        const [movieData, videosData, similarData, creditsData] = await Promise.all([
          getMovieDetails(id),
          getMovieVideos(id),
          getSimilarMovies(id),
          getMovieCredits(id),
        ]);
        setMovie(movieData);
        const officialTrailer = videosData.results?.find(
          v => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(officialTrailer || null);
        setSimilar(similarData.slice(0, 6));
        setCast(creditsData.cast?.slice(0, 10) || []);
      } catch (err) {
        setError("Failed to load movie details. Please try again.");
      }
    }
    fetchAll();
  }, [id]);

  if (error) return (
    <div className="details-error">
      <p>{error}</p>
      <button onClick={() => navigate(-1)}>← Go Back</button>
    </div>
  );

  if (!movie) return <div className="details-loading"><div className="spinner" /></div>;

  const favorite = isFavorite(movie.id);
  const inWatchlist = isInWatchlist(movie.id);

  return (
    <div className="movie-details-page" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}>
      <div className="overlay">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

        <div className="movie-details-container">
          <div className="poster">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image"}
              alt={movie.title}
              onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Image"; }}
            />
          </div>

          <div className="details">
            <h1>{movie.title}</h1>
            {movie.tagline && <h3 className="tagline">"{movie.tagline}"</h3>}
            <p className="overview">{movie.overview}</p>

            <div className="info-grid">
              <p><strong>Release Date:</strong> {movie.release_date}</p>
              <p><strong>Runtime:</strong> {movie.runtime} min</p>
              <p><strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1)} / 10</p>
              <p><strong>Popularity:</strong> {Math.round(movie.popularity)}</p>
            </div>

            {movie.genres && (
              <div className="genres-list">
                {movie.genres.map(g => <span key={g.id} className="genre-tag">{g.name}</span>)}
              </div>
            )}

            {movie.production_companies?.length > 0 && (
              <p className="production"><strong>Production:</strong> {movie.production_companies.map(c => c.name).join(", ")}</p>
            )}

            <div className="details-actions">
              <button
                className={`action-btn favorite-action ${favorite ? "active" : ""}`}
                onClick={() => favorite ? removeFromFavorites(movie.id) : addToFavorites(movie)}
              >
                {favorite ? "♥ Favorited" : "♡ Add to Favorites"}
              </button>
              <button
                className={`action-btn watchlist-action ${inWatchlist ? "active" : ""}`}
                onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
              >
                {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>
              {trailer && (
                <button className="action-btn trailer-action" onClick={() => setShowTrailer(true)}>
                  ▶ Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>

        {cast.length > 0 && (
          <section className="cast-section">
            <h2>Cast</h2>
            <div className="cast-grid">
              {cast.map(person => (
                <div key={person.id} className="cast-card">
                  <img
                    src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : PLACEHOLDER_PERSON}
                    alt={person.name}
                    onError={(e) => { e.target.src = PLACEHOLDER_PERSON; }}
                  />
                  <p className="cast-name">{person.name}</p>
                  <p className="cast-character">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="similar-section">
            <h2>Similar Movies</h2>
            <div className="movies-grid">
              {similar.map(m => <MovieCard movie={m} key={m.id} />)}
            </div>
          </section>
        )}
      </div>

      {showTrailer && trailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal-inner" onClick={e => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              allowFullScreen
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
