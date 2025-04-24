import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconChevronRight } from "@tabler/icons-react";
import { containerAnimation, itemAnimation } from "@/lib/animations";
import { useEvents } from "@/hooks/useEvents";
import { Link, useNavigate } from "react-router-dom";

const FeaturedHackathonsSection = () => {
  const { events } = useEvents();
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 md:px-10 bg-background">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerAnimation}
      >
        <motion.div variants={itemAnimation} className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Hackathons</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover exciting hackathons happening now and coming soon.
            </p>
          </div>
          <Link to="/events">
            <Button variant="outline" className="flex items-center gap-2">
              View All <IconChevronRight size={16} />
            </Button>
          </Link>
        </motion.div>
        
        <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events && events.slice(0, 3).map((event, index) => (
            <motion.div key={event._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card className="overflow-hidden h-full flex flex-col border border-muted">
                <div className="aspect-video w-full bg-muted relative">
                  {event.banner_url ? (
                    <img 
                      src={event.banner_url} 
                      alt={event.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20">
                      <span className="text-xl font-bold">{event.title?.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl mb-2">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {event.description || "Join this exciting hackathon to showcase your skills and win prizes"}
                  </p>
                  <div className="mt-auto">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {(!events || events.length === 0) && (
            <div className="col-span-3 py-10 text-center">
              <p className="text-muted-foreground">No hackathons available at the moment. Check back soon!</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturedHackathonsSection;