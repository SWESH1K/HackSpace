import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedNumbers from "react-animated-numbers";
import { containerAnimation, itemAnimation } from "@/lib/animations";

const StatisticsSection = () => {
  const [stats, setStats] = useState({
    events: 0,
    participants: 0,
    projects: 0,
    successRate: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        events: 50,
        participants: 1200,
        projects: 380,
        successRate: 69,
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 px-6 md:px-10 bg-muted/30">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerAnimation}
      >
        <motion.div variants={itemAnimation} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            HackSpace is powering innovation through hackathons worldwide.
          </p>
        </motion.div>
        
        <motion.div variants={itemAnimation} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem label="Hackathons Hosted" value={stats.events} />
          <StatItem label="Participants" value={stats.participants} suffix="+"/>
          <StatItem label="Projects Submitted" value={stats.projects} suffix="+"/>
          <StatItem label="Our Success Rate" value={stats.successRate} suffix="%" />
        </motion.div>
      </motion.div>
    </section>
  );
};

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
}

const StatItem = ({ label, value, suffix }: StatItemProps) => (
  <motion.div className="text-center">
    <div className="text-4xl md:text-5xl font-bold text-primary mb-2 flex justify-center">
      <AnimatedNumbers
        includeComma
        animateToNumber={value}
        locale="en-US"
      />
      {suffix && <span className="ml-1">{suffix}</span>}
    </div>
    <p className="text-muted-foreground">{label}</p>
  </motion.div>
);

export default StatisticsSection;