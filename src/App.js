import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BackgroundFX from "./components/BackgroundFX";
import Home from './pages/Home';
import Empty from './pages/Empty';
import Typography from './pages/Typography';


function App() {
  return (
     <>
      {/* Global, fixed background layer */}
      <BackgroundFX />

      {/* Routed content sits above background layer */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empty" element={<Empty />} />1
          <Route path="/typography" element={<Typography />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;