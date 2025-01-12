import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/useUser"

export default function NavBar() {
  const user = useUser();

  return (
    <nav className="flex justify-between items-center p-4 bg-background text-foreground">
      <div className="text-xl font-bold">HackSpace</div>
      <div>
        {
          !user &&
          <a href="/login"><Button>Login</Button></a>
        }
        {
          user &&
          <a href="/logout"><Button>Logout</Button></a>
        }
      </div>
    </nav>
  )
}