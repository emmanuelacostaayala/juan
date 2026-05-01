"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import HeroIntro from "@/components/HeroIntro";
import Hero from "@/components/sections/home/Hero";
import AboutJAR from "@/components/sections/home/AboutJAR";
import LarimarIntro from "@/components/sections/home/LarimarIntro";
import ClerhpBlock from "@/components/sections/home/ClerhpBlock";
import VisionQuote from "@/components/sections/home/VisionQuote";
import LatestNews from "@/components/sections/home/LatestNews";
import Faqs from "@/components/sections/home/Faqs";
import MediaGrid from "@/components/sections/home/MediaGrid";
import PodcastBlock from "@/components/sections/home/PodcastBlock";
import ContactSection from "@/components/sections/home/ContactSection";
import NewsletterBlock from "@/components/NewsletterBlock";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showIntro]);

  return (
    <>
      <AnimatePresence>
        {showIntro && <HeroIntro key="intro" />}
      </AnimatePresence>
      <main>
        <Hero />
        <AboutJAR />
        <LarimarIntro />
        <ClerhpBlock />
        <VisionQuote />
        <LatestNews />
        <Faqs />
        <MediaGrid />
        <PodcastBlock />
        <ContactSection />
        <NewsletterBlock />
      </main>
    </>
  );
}
