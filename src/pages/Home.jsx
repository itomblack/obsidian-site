import React from 'react';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import HeroCarousel from '../components/HeroCarousel'; 
// import FullBleedImage from '../components/FullBleedImage';

export default function Home() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <HeroCarousel/>
      {/* <FullBleedImage /> */}
    </>
  );
}
