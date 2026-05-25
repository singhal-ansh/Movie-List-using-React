import { NavLink } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Navbar.css";

function NavBar() {
  const { darkMode, toggleDarkMode, favorites, watchlist } = useMovieContext();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">🎬 MovieApp</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Home
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Favorites {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
        </NavLink>
        <NavLink to="/watchlist" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Watchlist {watchlist.length > 0 && <span className="nav-badge">{watchlist.length}</span>}
        </NavLink>
        <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle theme">
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
