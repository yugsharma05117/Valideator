import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import ReportPage from './pages/ReportPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import LeaderboardPage from './pages/LeaderboardPage';
import BrainstormPage from './pages/BrainstormPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/brainstorm" element={<BrainstormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
