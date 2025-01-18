import { HeroHighlightDemo } from "@/components/main-screen"
import { StickyScrollContent } from "@/components/scroll-details"
import { ScrollingTablet } from "@/components/scroll-tab-container"

const HomePage = () => {

    return (
    <div>
        <HeroHighlightDemo />
        <ScrollingTablet />
        <StickyScrollContent />
    </div>
    )
}

export default HomePage;