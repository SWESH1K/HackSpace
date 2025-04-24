import { motion } from "framer-motion";
import { containerAnimation, itemAnimation } from "@/lib/animations";

const steps = [
  { step: 1, title: "Register", description: "Sign up and create your profile" },
  { step: 2, title: "Join or Create", description: "Join an existing hackathon or create your own" },
  { step: 3, title: "Form Teams", description: "Create or join a team for collaboration" },
  { step: 4, title: "Build & Submit", description: "Develop your solution and submit for evaluation" },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-6 md:px-10 bg-muted/50">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerAnimation}
      >
        <motion.div variants={itemAnimation} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to get started with HackSpace.
          </p>
        </motion.div>
        
        <motion.div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemAnimation} className="flex-1 flex flex-col items-center text-center">
              <div className="rounded-full w-12 h-12 bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;