import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import ScrollDots from './components/ScrollDots';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Services from './components/Services';
import Contact from './components/Contact';
import ProjectPage from './components/ProjectPage';
import CVDownloadButton from './components/CVDownloadButton';

const LandingPage = ({ onHeroReady }) => (
  <>
    <Hero onHeroReady={onHeroReady} />
    <AboutMe />
    <Services />
    <Projects />
    <Skills />
    <Contact />
  </>
);

function App() {
  const [loading, setLoading] = useState(true);
  const [bootDone, setBootDone] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const location = useLocation();

  const handleBootDone = useCallback(() => setBootDone(true), []);
  const handleHeroReady = useCallback(() => setHeroReady(true), []);

  useEffect(() => {
    if (bootDone && heroReady) {
      setLoading(false);
    }
  }, [bootDone, heroReady]);

  // Global Sync Heartbeat for blinking dots
  useEffect(() => {
    const interval = setInterval(() => {
      const current = document.documentElement.getAttribute('data-blink') === 'true';
      document.documentElement.setAttribute('data-blink', (!current).toString());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Is this a dedicated page?
  const isProjectPage = location.pathname.startsWith('/project/');

  // Handle Hash Scroll on navigation
  useEffect(() => {
    if (location.hash && !loading) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const top = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 150); // Increased delay slightly to ensure DOM is fully ready
    }
  }, [location, loading]);

  return (
    <>
      {loading && !isProjectPage && <LoadingScreen onDone={handleBootDone} />}

      <div
        className="relative w-full min-h-screen"
        style={{
          opacity: (loading && !isProjectPage) ? 0 : 1,
          transition: 'opacity 0.6s ease 0.1s',
          visibility: (loading && !isProjectPage) ? 'hidden' : 'visible',
        }}
      >
        {!isProjectPage && <Navbar />}
        {!isProjectPage && <ScrollDots />}
        <main>
          <Routes>
            <Route path="/" element={<LandingPage onHeroReady={handleHeroReady} />} />
            <Route path="/project/:slug" element={<ProjectPage />} />
          </Routes>
        </main>
        <CVDownloadButton />
      </div>
    </>
  );
}

export default App;
