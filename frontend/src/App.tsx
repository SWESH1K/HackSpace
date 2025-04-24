// import NavBar from './components/NavBar';
import Footer from './components/footer';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventsPage';
import {Routes, Route} from "react-router-dom";
import CreateEventPage from './pages/CreateEventPage';
import { Toaster } from './components/ui/toaster';
import SingleEventPage from './pages/SingleEventPage';

function Home() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/events" element={<EventPage />}></Route>
        <Route path="/events/:id" element={<SingleEventPage />}></Route>
        <Route path="/create-event" element={<CreateEventPage />}></Route>
        <Route path="/" element={<HomePage />}></Route>
      </Routes>
      <Toaster />
      <Footer />
    </div>
  );
}

export default Home;