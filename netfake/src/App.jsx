import React from "react";
import "./App.css"; // Pode deixar vazio se usou index.css
import Row from "./components/Row";
import Banner from "./components/Banner";
import Nav from "./components/Nav";
/*import { requests } from "./api/django";*/

function App() {
  return (
    <div className="app">
      <Nav />
      <Banner />
      
      <Row 
        title="ORIGINAIS NETFLIX" 
        fetchUrl={requests.fetchNetflixOriginals} 
        isLargeRow 
      />
      <Row title="Tendências" fetchUrl={requests.fetchTrending} />
      <Row title="Em Alta" fetchUrl={requests.fetchTopRated} />
      <Row title="Ação" fetchUrl={requests.fetchActionMovies} />
      <Row title="Comédia" fetchUrl={requests.fetchComedyMovies} />
      <Row title="Terror" fetchUrl={requests.fetchHorrorMovies} />
      <Row title="Romance" fetchUrl={requests.fetchRomanceMovies} />
      <Row title="Documentários" fetchUrl={requests.fetchDocumentaries} />
    </div>
  );
}

export default App;