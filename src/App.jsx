import Search from "./components/Search"
import { useState } from "react";

const App = () => {
  
  const [searchTerm, setSearchTerm] = useState('');


  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src='./hero-img.png' alt='Hero Banner'/>
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Right Now</h1>
        </header>
        
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>
    </main>
  )
}

export default App