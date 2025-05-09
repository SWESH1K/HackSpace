import { useEvents } from "../hooks/useEvents";
import CardDemo from "../components/event-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import {  Plus } from "lucide-react";
import NavBar from "@/components/NavBar";


const EventPage = () => {
  const { events, myevents, user, loading, error } = useEvents();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <NavBar />
    <Tabs defaultValue="all" className=" overflow-x-hidden mb-3 pt-[5%] min-h-screen ml-10 mr-10">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="my-hackathons">My Hackathons</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="h-auto w-full min-h-[1000px] max-h-[1000px] bg-gray-300 dark:bg-neutral-900 overflow-x-hidden overflow-y-auto p-[20px]" style={{ paddingTop: 50 }}>
            <h1 className="font-bold item-left sm:text-[34px] lg:text-[34px] text-center">All Hackathons</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto my-10" style={{ width: '100vw', paddingInline: '15%'}}>
              {events.map((event) => (
                <CardDemo key={event._id} event={event} />
              ))}
            </div>
        </div>
      </TabsContent>
      <TabsContent value="my-hackathons">
        <div className="h-auto w-full min-h-[1000px] max-h-[1000px] bg-gray-300 dark:bg-neutral-900 overflow-x-hidden overflow-y-auto p-[20px]" style={{ paddingTop: 50 }}>
            <h1 className="font-bold item-left sm:text-[34px] lg:text-[34px] text-center">Your Hackathons</h1>
              <a href="/create-event" className="flex justify-end mr-[5%]">
              <Button>
                <Plus/>Create
              </Button>         
              </a>
            
              {/* Text shown when the user is not logged In. */}
              {!user && <h6 className="font-sans text-[24px] text-center text-gray-500">Login to Create or View your hackathons!</h6>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto my-10" style={{ width: '100vw', paddingInline: '15%'}}>
              {myevents.map((event) => (
                <CardDemo key={event._id} event={event} />
              ))}
            </div>
        </div>
      </TabsContent>
    </Tabs>
    </>
  );
};

export default EventPage;