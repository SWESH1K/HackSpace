import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-300 text-gray-900 dark:bg-gray-900 dark:text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">HackSpace</h2>
          <p className="text-sm">The go-to space for Hackathons</p>
        </div>
        <div className="flex space-x-4">
          <a href="https://github.com/SWESH1K/HackSpace">
            <Button  className="text-sm">
                GitHub
            </Button>
          </a>
          <a href="https://t.me/sweshik">
            <Button  className="text-sm">
                Contact
            </Button>
          </a>
          <Button  className="text-sm">
            Privacy Policy
          </Button>
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-xs">&copy; {new Date().getFullYear()} HackSpace. All rights reserved.</p>
      </div>
    </footer>
  );
}