import { useEvents } from "../hooks/useEvents";
import CardDemo from "../components/event-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


const EventPage = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Tabs defaultValue="all" className=" overflow-x-hidden mb-3 pt-[5%]">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="my-hackathons">My Hackathons</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="h-auto w-full max-h-[1000px] flex flex-col items-center justify-center bg-gray-300 dark:bg-neutral-900 overflow-x-hidden overflow-y-auto p-[20px]" style={{ paddingTop: 50 }}>
            <h1 className="font-bold item-left sm:text-[50px] lg:text-[50px]">All Hackathons</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto my-10" style={{ width: '100vw', paddingInline: '15%'}}>
              {events.map((event) => (
                <CardDemo key={event._id} event={event} />
              ))}
            </div>
        </div>
      </TabsContent>
      <TabsContent value="my-hackathons">
        <div className="h-auto w-full max-h-[1000px] flex flex-col items-center justify-center bg-gray-300 dark:bg-neutral-900 overflow-x-hidden overflow-y-auto p-[20px]" style={{ paddingTop: 50 }}>
            <h1 className="font-bold item-left sm:text-[50px] lg:text-[50px]">Your Hackathons</h1>
              <a href="/create-event" className="self-end mr-[5%]">
              <Button>
                <Plus/>Create
              </Button>         
              </a>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto my-10" style={{ width: '100vw', paddingInline: '15%'}}>
              {events.map((event) => (
                <CardDemo key={event._id} event={event} />
              ))}
            </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EventPage;