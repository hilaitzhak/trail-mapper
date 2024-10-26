import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import TrailDetailScreen from './screens/TrailDetailScreen';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/trail/:id" element={<TrailDetailScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;