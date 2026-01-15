import React from 'react';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import HeroCarousel from '../components/HeroCarousel'; 
// import AnnouncementBanner from '../components/AnnouncementBanner';
import BrandsGrid from '../components/BrandsGrid';
import ReviewsCarousel from '../components/ReviewsCarousel';
// import FullBleedImage from '../components/FullBleedImage';

export default function Home() {
  return (
    <>
      <NavBar />
      {/* <AnnouncementBanner /> */}
      <HeroSection />
      <HeroCarousel/>
      <BrandsGrid /> 
      <ReviewsCarousel />
      {/* <div className="HomeSpacer"></div> */}
      {/* <FullBleedImage /> */}
    </>
  );
}
