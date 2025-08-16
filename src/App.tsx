import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './views/home';
import Genero from './views/genero';
import AdminLogin from './views/admin/login';
import Dashboard from './views/admin/dashboard';
import ComicPost from './components/ComicPost';
import { AuthProvider, RequireAuth } from './types/loginContexto';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/comics" element={<Home />} />
            <Route path="/comics/:slug" element={<ComicPost />} />
            <Route path="/generos" element={<Genero />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
