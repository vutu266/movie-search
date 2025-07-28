import Search from "./components/Search"
import { useState, useEffect } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovie, updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY =  import.meta.env.VITE_TMDB_API_KEY;

const API_OPTION = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('')

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, 
  [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('')
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTION);
      
      if(!response.ok){
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      
      if(data.response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.log(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movies, please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovie();
      setTrendingMovies(movies)

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchTerm)
  }, [debounceSearchTerm])
  
  useEffect(() => {
    loadTrendingMovies();
  }, [])
  

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src='./hero-img.png' alt='Hero Banner'/>
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Right Now</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title}/>
              </li>
            ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All movies</h2>

          {isLoading ? (
            <Spinner />)
           : errorMessage ? (<p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>{movieList.map(movie => (
              <MovieCard id={movie.id} movie={movie}/>
            ))}</ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App