import { useEvents } from "../hooks/useEvents";
import CardDemo from "../components/event-card";
import { Tabs } from "../components/ui/tabs";

const EventPage = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const tabs = [
    {
      title: "All",
      value: "hackathons",
      content: (
        <div className="h-auto w-full max-h-[1500px] flex flex-col items-center justify-center bg-gray-300 dark:bg-neutral-900 overflow-x-hidden overflow-y-auto p-[20px]" style={{ paddingTop: 50 }}>
          <h1 className="font-bold item-left sm:text-[50px] lg:text-[50px]">Hackathons near you</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto my-10" style={{ width: '80vw', paddingInline: '15%'}}>
            {events.map((event) => (
              <CardDemo key={event._id} event={event} />
            ))}
          </div>
        </div>
      )
    },
    {
      title: "My Hackathons",
      value: "my-hackathons",
      content: (
        <div className="h-auto w-full max-h-[1500px] flex flex-col items-center justify-center bg-gray-300 dark:bg-neutral-900 overflow-x-hidden overflow-y-auto p-[20px]" style={{ paddingTop: 50 }}>
          <h1 className="font-bold item-left sm:text-[50px] lg:text-[50px]">Your Hackathons</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto my-10" style={{ width: '80vw', paddingInline: '15%'}}>
            {events.map((event) => (
              <CardDemo key={event._id} event={event} />
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="h-[1500px] min-h-screen">
      <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-7xl mx-auto w-full  items-start justify-start py-40">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default EventPage;