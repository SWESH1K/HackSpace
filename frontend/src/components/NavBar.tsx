import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import UserButton from "@/components/UserButton";
import { ModeToggle } from "./mode-toggle";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex flex-col md:flex-row justify-between items-start md:items-center p-2 md:p-4 bg-transparent">
      <div className="flex justify-between items-center w-full md:w-auto">
        <div className="text-xl md:text-3xl font-bold">HackSpace</div>
        <button className="md:hidden text-xl" onClick={toggleMenu}>
          ☰
        </button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto md:flex"
          >
            <ModeToggle />
            {!user && (
              <a href="/login">
                <Button className="text-sm md:text-base">Login</Button>
              </a>
            )}
            {user && <UserButton user={user} />}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto hidden md:flex">
        <ModeToggle />
        {!user && (
          <a href="/login">
            <Button className="text-sm md:text-base">Login</Button>
          </a>
        )}
        {user && <UserButton user={user} />}
      </div>
    </nav>
  );
}