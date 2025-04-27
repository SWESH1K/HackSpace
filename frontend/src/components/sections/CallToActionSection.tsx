import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { containerAnimation, itemAnimation } from "@/lib/animations";

const CallToActionSection = () => {
  return (
    <section className="py-24 px-6 md:px-10 bg-gradient-to-br from-primary/10 to-secondary/10">
      <motion.div
        className="max-w-4xl mx-auto relative"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerAnimation}
      >
        <motion.h2 variants={itemAnimation} className="text-3xl md:text-5xl font-bold mb-6 justify-content-center text-center">
          Ready to Join the Innovation?
        </motion.h2>
        
        <motion.p variants={itemAnimation} className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
          Whether you're organizing a hackathon or looking to participate, HackSpace provides all the tools you need for success.
        </motion.p>
        
        <motion.div variants={itemAnimation} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/create-event">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Host a Hackathon
            </Button>
          </a>
          <Button size="lg" variant="outline">
            Explore Opportunities
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CallToActionSection;