import NavBar from "@/components/NavBar";
import { ScrollingTablet } from "@/components/scroll-tab-container";
import { HeroHighlightDemo } from "@/components/main-screen";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturedHackathonsSection from "@/components/sections/FeaturedHackathonsSection";
import CallToActionSection from "@/components/sections/CallToActionSection";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <HeroHighlightDemo />
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <ScrollingTablet />
      </div>
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedHackathonsSection />
      <CallToActionSection />
    </div>
  );
};

export default HomePage;