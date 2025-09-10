import "../css/MovieDetails.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/api";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        console.error("Failed to fetch movie details", err);
      }
    }
    fetchMovie();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div
      className="movie-details-page"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="overlay">
        <div className="movie-details-container">
          {/* Poster */}
          <div className="poster">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </div>

          {/* Details */}
          <div className="details">
            <h1>{movie.title}</h1>
            {movie.tagline && <h3 className="tagline">"{movie.tagline}"</h3>}
            <p className="overview">{movie.overview}</p>

            <div className="info-grid">
              <p><strong>Release Date:</strong> {movie.release_date}</p>
              <p><strong>Runtime:</strong> {movie.runtime} min</p>
              <p><strong>Rating:</strong> ⭐ {movie.vote_average} / 10</p>
              <p><strong>Popularity:</strong> {movie.popularity}</p>
            </div>

            {movie.genres && (
              <p>
                <strong>Genres:</strong>{" "}
                {movie.genres.map((g) => g.name).join(", ")}
              </p>
            )}

            {movie.production_companies && (
              <p>
                <strong>Production:</strong>{" "}
                {movie.production_companies.map((c) => c.name).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
