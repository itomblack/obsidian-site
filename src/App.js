import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import BackgroundFX from "./components/BackgroundFX";
import Home from './pages/Home';
import Empty from './pages/Empty';
import Typography from './pages/Typography';
import ExploreIndex from './pages/explore/ExploreIndex';
import ConceptMonolith from './pages/explore/ConceptMonolith';
import ConceptConstellation from './pages/explore/ConceptConstellation';
import ConceptLens from './pages/explore/ConceptLens';
import ConceptTriptych from './pages/explore/ConceptTriptych';

function ConditionalBackgroundFX() {
  const location = useLocation();
  // Each /explore concept supplies its own background, so suppress the global one.
  if (location.pathname.startsWith('/explore')) return null;
  return <BackgroundFX />;
}

function App() {
  return (
    <Router>
      <ConditionalBackgroundFX />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/empty" element={<Empty />} />1
        <Route path="/typography" element={<Typography />} />
        <Route path="/explore" element={<ExploreIndex />} />
        <Route path="/explore/monolith" element={<ConceptMonolith />} />
        <Route path="/explore/constellation" element={<ConceptConstellation />} />
        <Route path="/explore/lens" element={<ConceptLens />} />
        <Route path="/explore/triptych" element={<ConceptTriptych />} />
      </Routes>
    </Router>
  );
}

export default App;