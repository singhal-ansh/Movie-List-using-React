import "../css/MovieDetails.css";
import { useParams } from "react-router-dom"; 
import { useEffect, useState } from "react";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=09fdfed360c190ae85e33688ce80ec85&language=en-US`
      );
      const data = await res.json();
      setMovie(data);
    }
    fetchMovie();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-details">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <p><strong>Rating:</strong> {movie.vote_average}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
    </div>
  );
}

export default MovieDetails;
