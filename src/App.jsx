import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import { PlayerProvider } from './context/PlayerContext';
import MusicPlayerLightbox from './components/MusicPlayerLightbox';
import MiniPlayerDock from './components/MiniPlayerDock';
import './index.css';

function App() {
  return (
    <Router>
      <PlayerProvider>
        <div className="layout-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/song/:id" element={<Detail />} />
          </Routes>
          <MusicPlayerLightbox />
          <MiniPlayerDock />
        </div>
      </PlayerProvider>
    </Router>
  );
}

export default App;
