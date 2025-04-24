import NavBar from "@/components/NavBar";
import { ScrollingTablet } from "@/components/scroll-tab-container";
import { StickyScrollContent } from "@/components/scroll-details";
import { HeroHighlightDemo } from "@/components/main-screen";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturedHackathonsSection from "@/components/sections/FeaturedHackathonsSection";
import StatisticsSection from "@/components/sections/StatisticsSection";
import CallToActionSection from "@/components/sections/CallToActionSection";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <HeroHighlightDemo />
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedHackathonsSection />
      <StatisticsSection />
      <CallToActionSection />
      <ScrollingTablet />
      <StickyScrollContent />
    </div>
  );
};

export default HomePage;