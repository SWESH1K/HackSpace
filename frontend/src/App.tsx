import { useUser } from './hooks/useUser';
import NavBar from './components/NavBar';
import Footer from './components/footer';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventsPage';
import {Routes, Route} from "react-router-dom";
import CreateEventPage from './pages/CreateEventPage';
import { Toaster } from './components/ui/toaster';

function Home() {
  const user = useUser();

  console.log(user?.picture);

  return (
    <div className="min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/events" element={<EventPage />}></Route>
        <Route path="/create-event" element={<CreateEventPage />}></Route>
        <Route path="/" element={<HomePage />}></Route>
      </Routes>
      <Toaster />
      <Footer />
    </div>
  );
}

export default Home;