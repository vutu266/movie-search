import Search from "./components/Search"
import { useState, useEffect } from "react";

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
  const [isLoading, setIsLoading] = useState(false)

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('')
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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

    } catch (error) {
      console.log(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movies, please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
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
        
        <section className="all-movies">
          <h2>All movies</h2>

          {isLoading ? (
            <p className="text-white">Loading...</p>)
           : errorMessage ? (<p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>{movieList.map(movie => (
              <p className="text-white">{movie.title}</p>
            ))}</ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App