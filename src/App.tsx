import './App.css'
import Mood from './components/Mood'
import Channel from './components/Channel'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import React from 'react';

const moodList = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Energetic Vibes',
    description: 'Feel the energy with these upbeat tunes.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    title: 'Chill Waves',
    description: 'Relax and unwind with calming melodies.'
  },
  {
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    title: 'Coffeehouse Jams',
    description: 'Perfect background music for your coffee break.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    title: 'Dreamy Nights',
    description: 'Soothing sounds for late-night relaxation.'
  },
  {
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    title: 'Sunny Mornings',
    description: 'Start your day with bright, uplifting tunes.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
    title: 'Focus Flow',
    description: 'Stay productive with focused instrumentals.'
  },
  {
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    title: 'Rainy Day',
    description: 'Cozy up with mellow, rainy day music.'
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Party Time',
    description: 'Get the party started with these hits.'
  }
]

function AppContent() {
  const location = useLocation();
  const isChannelPage = location.pathname === '/channels';

  return (
    <div className="app-container min-h-screen flex flex-col">
      <Header />
      {/* Main content: Routes */}
      <main className="main-content flex-1 bg-[#111] px-8 py-8">
        <Routes>
          <Route path="/" element={
            <div className="mood-list flex flex-wrap gap-9 justify-center items-start">
              {moodList.map((mood, idx) => (
                <Mood key={idx} image={mood.image} title={mood.title} description={mood.description} />
              ))}
            </div>
          } />
          <Route path="/channels" element={<Channel />} />
          <Route path="/search" element={<div className="text-white">Search Page Coming Soon</div>} />
          <Route path="/mood" element={<div className="text-white">Mood Page Coming Soon</div>} />
        </Routes>
      </main>
      {/* Conditionally render Footer */}
      {!isChannelPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
