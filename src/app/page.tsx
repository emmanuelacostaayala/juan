import Header from "@/components/Header";
import Hero from "@/components/Hero"; // Block 1
import About from "@/components/About"; // Block 2
import ProjectStar from "@/components/ProjectStar"; // Block 3
import Corporate from "@/components/Corporate"; // Block 4
import HistoryTimeline from "@/components/HistoryTimeline"; // Block 5
import FeaturedContent from "@/components/FeaturedContent"; // Block 6
import Media from "@/components/Media"; // Block 7
import NewsletterBlock from "@/components/NewsletterBlock"; // Block 8
import StrategicContact from "@/components/StrategicContact"; // Block 9
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <ProjectStar />
      <Corporate />
      <HistoryTimeline />
      <FeaturedContent />
      <Media />
      <NewsletterBlock />
      <StrategicContact />
      <Footer />
      <NewsletterPopup />
    </main>
  );
}
