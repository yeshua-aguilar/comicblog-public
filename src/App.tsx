import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './views/home';
import Genero from './views/genero';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comics" element={<Home />} />
          <Route path="/generos" element={<Genero />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
