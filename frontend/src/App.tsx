import { useUser } from './hooks/useUser';
import { HeroHighlightDemo } from "./components/main-screen";
import NavBar from './components/NavBar';
import { ScrollingTablet } from './components/scroll-tab-container';

function Home() {
  const user = useUser();

  console.log(user?.picture);

  return (
    <div className="full-screen">
      <NavBar />
      <HeroHighlightDemo />
      <ScrollingTablet />
    </div>
  );
}

export default Home;