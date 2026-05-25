import { createContext, useState, useContext, useEffect } from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const storedFavs = localStorage.getItem("favorites")
    const storedWatchlist = localStorage.getItem("watchlist")
    const storedDarkMode = localStorage.getItem("darkMode")
    if (storedFavs) setFavorites(JSON.parse(storedFavs))
    if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist))
    if (storedDarkMode !== null) setDarkMode(JSON.parse(storedDarkMode))
  }, [])

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const addToFavorites = (movie) => setFavorites(prev => [...prev, movie])
  const removeFromFavorites = (movieId) => setFavorites(prev => prev.filter(m => m.id !== movieId))
  const isFavorite = (movieId) => favorites.some(m => m.id === movieId)

  const addToWatchlist = (movie) => setWatchlist(prev => [...prev, movie])
  const removeFromWatchlist = (movieId) => setWatchlist(prev => prev.filter(m => m.id !== movieId))
  const isInWatchlist = (movieId) => watchlist.some(m => m.id === movieId)

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <MovieContext.Provider value={{
      favorites, addToFavorites, removeFromFavorites, isFavorite,
      watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist,
      darkMode, toggleDarkMode
    }}>
      {children}
    </MovieContext.Provider>
  )
}
