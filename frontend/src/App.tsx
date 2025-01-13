import { useUser } from './hooks/useUser';
import { HeroHighlightDemo } from "./components/main-screen";
import NavBar from './components/NavBar';

function Home() {
  const user = useUser();

  console.log(user?.picture);

  return (
    <div className="full-screen">
      <NavBar />
      <HeroHighlightDemo />
    </div>
  );
}

export default Home;