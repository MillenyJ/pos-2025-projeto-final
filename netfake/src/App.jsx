import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// Importando os componentes
import Users from "./components/Users";
import WatchList from "./components/WatchList";
import Reviews from "./components/Reviews";
import Gallery from "./components/Gallery";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        
        {/* --- NAVBAR (Menu do Topo) --- */}
        <nav className="navbar">
          <Link to="/" className="logo">NETFAKE</Link>
          <div className="nav-links">
            <Link to="/users">PERFIS</Link>
            <Link to="/watchlist">MINHA LISTA</Link>
            <Link to="/reviews">CRÍTICAS</Link>
            <Link to="/gallery">GALERIA</Link>
          </div>
        </nav>

        {/* --- ÁREA DE CONTEÚDO --- */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={
              <div className="home-container">
                <h1>Painel Administrativo Netfake</h1>
                <p>Gerencie usuários, filmes e críticas usando o menu acima.</p>
              </div>
            } />
            
            <Route path="/users" element={<Users />} />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;