import "../css/MovieDetails.css";
import { useParams } from "react-router-dom"; 
import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/api"; // ✅ Import function

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const data = await getMovieDetails(id); // ✅ Use service function
        setMovie(data);
      } catch (err) {
        console.error("Failed to fetch movie details", err);
      }
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
