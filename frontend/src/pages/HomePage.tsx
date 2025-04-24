import { HeroHighlightDemo } from "@/components/main-screen"
import NavBar from "@/components/NavBar"
import { StickyScrollContent } from "@/components/scroll-details"
import { ScrollingTablet } from "@/components/scroll-tab-container"

const HomePage = () => {

    return (
    <div>
        <NavBar />
        <HeroHighlightDemo />
        <ScrollingTablet />
        <StickyScrollContent />
    </div>
    )
}

export default HomePage;