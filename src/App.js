import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import DesignSystem from './pages/DesignSystem';
import PhoneExperience from './components/PhoneExperience';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PhoneExperience />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
