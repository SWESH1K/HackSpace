import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import UserButton from "@/components/UserButton";
import { ModeToggle } from "./mode-toggle";

export default function NavBar() {
  const user = useUser();

  return (
    <nav className="flex justify-between items-center p-4 mb-7">
      <div className="text-3xl font-bold">HackSpace</div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {!user && (
          <a href="/login">
            <Button>Login</Button>
          </a>
        )}
        {user && <UserButton user={user} />}
      </div>
    </nav>
  );
}