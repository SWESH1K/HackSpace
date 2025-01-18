import { useUser } from './hooks/useUser';
import NavBar from './components/NavBar';
import Footer from './components/footer';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventsPage';
import {Routes, Route} from "react-router-dom";

function Home() {
  const user = useUser();

  console.log(user?.picture);

  return (
    <div className="full-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/events" element={<EventPage />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default Home;