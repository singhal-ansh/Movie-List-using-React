import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function Watchlist() {
  const { watchlist } = useMovieContext();

  if (watchlist.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>Your Watchlist is Empty</h2>
        <p>Add movies you want to watch later and they will appear here!</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2>Your Watchlist <span className="count-badge">{watchlist.length}</span></h2>
      <div className="movies-grid">
        {watchlist.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
}

export default Watchlist;
