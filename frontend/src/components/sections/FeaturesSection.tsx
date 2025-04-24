import { motion } from "framer-motion";
import { 
  IconBulb, 
  IconRocket, 
  IconUsers, 
  IconTrophy,
  IconBellRinging,
  IconChartBar
} from "@tabler/icons-react";
import { containerAnimation, itemAnimation } from "@/lib/animations";
import { HoverEffect } from "@/components/ui/card-hover-effect";

const features = [
  {
    icon: <IconBulb size={40} />,
    title: "Problem Statements",
    description: "Create and publish engaging problem statements for participants.",
    link: "#problem-statements"
  },
  {
    icon: <IconRocket size={40} />,
    title: "Event Management",
    description: "Create and manage hackathon events with ease. Set timelines, rules, and prize money.",
    link: "#event-management"
  },
  {
    icon: <IconUsers size={40} />,
    title: "Team Collaboration",
    description: "Seamless team registration and management with role-based permissions.",
    link: "#team-collaboration"
  },
  {
    icon: <IconBellRinging size={40} />,
    title: "Real-time Updates",
    description: "Stay informed with live event updates, timelines, and important announcements.",
    link: "#updates"
  },
  {
    icon: <IconTrophy size={40} />,
    title: "Evaluation System",
    description: "Custom evaluation patterns with fair scoring and result tabulation.",
    link: "#evaluation"
  },
  {
    icon: <IconChartBar size={40} />,
    title: "Results & Leaderboard",
    description: "Track progress with round-wise results and final rankings with medals.",
    link: "#results"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 md:px-10 bg-background">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerAnimation}
      >
        <motion.div variants={itemAnimation} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Hackathon Success</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to organize and participate in successful hackathons, all in one platform.
          </p>
        </motion.div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-[1100px]">
            <HoverEffect 
              items={features.map(feature => ({
                title: (
                  <div className="flex items-center gap-3 text-lg">
                    <div className="rounded-full bg-primary/10 p-3 w-fit">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </div>
                ),
                description: feature.description,
                link: feature.link
              }))}
              className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;