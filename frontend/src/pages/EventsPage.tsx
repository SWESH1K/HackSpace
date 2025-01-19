import { useEvents } from "../hooks/useEvents";
import CardDemo from "../components/event-card";

const EventPage = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="full-screen flex items-center justify-center" style={{ paddingTop: 50 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[0px] overflow-auto" style={{ maxHeight: '80vh', width: '100vw', paddingInline: '15%'}}>
        {events.map((event) => (
          <CardDemo key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventPage;